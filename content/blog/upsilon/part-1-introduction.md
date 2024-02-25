---
title: "Upsilon part I: Introduction"
date: 2022-12-02
---
So, I've been working on a new self-hosted git server for almost a month now, and I would like to share some of the things I learned along the way, and also document the journey in the form of this section of my blog. This is the first part of a series of posts about [upsilon](https://github.com/dnbln/upsilon), my new git server.

As of right now, it can talk the `git://` and `http://` protocols with the `git` client, allowing for `clone`s, `pull`s and `push`es, which is enough to be among git servers what brainfuck is among programming languages, enough to do everything you would technically _need_ from a git server, but **_very_** (and I do mean **_very_**) **_far off_** from what you would expect from one.

## Why?

I always wanted to write a fair bit of developer tooling. This may be just another failed attempt, or it may be the start of something.

I got to learn a lot along the way, and I don't regret it.

Now that the why is out of the way, let's get to the how.

## How?

So, the stock `git` package in most distributions is enough to be used for a full server, but the binaries that we're interested in specifically are `git-daemon` for the `git://` protocol ([guide](https://git-scm.com/book/en/v2/Git-on-the-Server-Git-Daemon) and [documentation](https://git-scm.com/docs/git-daemon)), and `git-http-backend` for the `http://` protocol ([guide](https://git-scm.com/book/en/v2/Git-on-the-Server-Smart-HTTP) and [documentation](https://git-scm.com/docs/git-http-backend)).

### For the `git://` protocol

The `git-daemon` binary is a daemon that listens on a port (by default `9418`) and handles the necessary communication with git clients that connect to it. It is the easier of the two protocols to set up, as that only involves running the daemon somewhere and ensure it keeps running for as long as we need it.

The guide suggests doing it as a `systemd` service, but the approach I went with was to run it as a child process of the main server process (while still allowing users to disable that and run the daemon manually, should they wish to do so).

[Link](https://github.com/dnbln/upsilon/blob/52921f2250612d936cf42652739731ec54fdd8f5/crates/upsilon-vcs/src/daemon.rs#L40-L50)With some more code to handle overrides, but that's not that important.[Link](https://github.com/dnbln/upsilon/blob/52921f2250612d936cf42652739731ec54fdd8f5/crates/upsilon-vcs/src/daemon.rs#L95-L97)

(`config.get_path()` is the path to the root directory where all the repositories are stored.)

After that, everything we have to do is hold onto that child, until the web server shuts down, and just send it a signal when that happens:

[Link](https://github.com/dnbln/upsilon/blob/52921f2250612d936cf42652739731ec54fdd8f5/crates/upsilon-web/src/git/git_protocol.rs#L45-L52)

But... we are not done, yet...

Every time we create a git repository, we also have to create a magic `git-daemon-export-ok` file, or otherwise the git daemon will refuse to serve it. This is done here:

[Link](https://github.com/dnbln/upsilon/blob/52921f2250612d936cf42652739731ec54fdd8f5/crates/upsilon-vcs/src/lib.rs#L371-L375)

Since there is no authentication on the `git://` protocol, we have to make sure the repository is "public", or otherwise everyone would be able to access it.

Note: although it's actually possible to use the `git://` protocol for pushing, because it's not authenticated that is a very bad idea. If you would like to try it, you can `--enable` the disabled-by-default `git-receive-pack` service (`--enable=git-receive-pack`). But, again, that is a very bad idea. This allows the git daemon to receive packs, which are basically what commits are made out of. This means that _anyone_(and I mean _anyone_ and _everyone_ who can reach the daemon) can now push to any repository under the base path, provided it has the magic `git-daemon-export-ok` file.

### For the `http://` protocol

Now, this is where the _real_ fun begins.

The `git-http-backend` binary is actually a [CGI](https://en.wikipedia.org/wiki/Common_Gateway_Interface) "script". That is basically an executable file which is run whenever we receive a request on some path. The way CGI works is by passing the path, HTTP method, query string and headers to the executable as environment variables, and then give the request body to it through the process' `stdin`. The executable then has to return the headers and then the response body through the process' `stdout`, in a similar format to normal HTTP responses, except for a few minor differences, of which the most important is the "Status:" header, which is used to specify the HTTP status code.

All in all, this is the code for setting up the environment of the CGI script:

[Link](https://github.com/dnbln/upsilon/blob/52921f2250612d936cf42652739731ec54fdd8f5/crates/upsilon-vcs/src/http_backend.rs#L232-L276)

And passing along the request body:

[Link](https://github.com/dnbln/upsilon/blob/52921f2250612d936cf42652739731ec54fdd8f5/crates/upsilon-vcs/src/http_backend.rs#L278-L290)

And then parsing the headers:

[Link](https://github.com/dnbln/upsilon/blob/52921f2250612d936cf42652739731ec54fdd8f5/crates/upsilon-vcs/src/http_backend.rs#L292-L330)

Then everything we have to do is relay the response body, which happens in `upsilon_web`:

[Link](https://github.com/dnbln/upsilon/blob/52921f2250612d936cf42652739731ec54fdd8f5/crates/upsilon-web/src/git/git_http_protocol.rs#L353-L371)

As you can see, the http protocol requires a little more involvement from the web server's side, but it's not that bad. We get to do authenticated requests now, which is a must for a git server, especially for pushing.

Note: the `git-http-backend` binary also looks for the `git-daemon-export-ok` file, and if not present it will reject the request. This can be overridden with the `GIT_HTTP_EXPORT_ALL` environment variable, but I personally would not recommend it.

### Authentication under the `http://` protocol

`git-http-backend` does not handle authentication, it's up to us as the middle man to handle it.

Like most http servers, the process of authentication works like this:

- the client sends an unauthenticated request to the server.
- the server reads the request. If it decides that the request needs to be authenticated, it sends a `401 Unauthorized` response, with a `WWW-Authenticate` header, which contains the authentication scheme (and some other information).
- the client reads the response, and if it's a `401` with a `WWW-Authenticate` header, it prompts the user to enter the credentials, then performs the request again, passing the credentials along this time.
- the server reads the request, and now decides that it's authenticated, so it finally performs the actual request.

That is actually straight-forward enough. `git push`es will have a path that ends in `git-receive-pack` or the query string `service=git-receive-pack`, so we can use that to decide whether we need an `Authorization` header. If we do, and don't have that, we send a `401 Unauthorized` response with the header `WWW-Authenticate: Basic`, which will make the git client prompt the user for a user and password (or ask the credential manager for it, but that's beyond the scope of the server). Then, when the git client performs the request again, we can check the `Authorization` header, and if it's valid, we can finally pass along the request to `git-http-backend`.

Most of this happens in `upsilon_web`:

[Link](https://github.com/dnbln/upsilon/blob/52921f2250612d936cf42652739731ec54fdd8f5/crates/upsilon-web/src/git/git_http_protocol.rs#L435-L463)

`auth_if_user_has_necessary_permissions` will error if the user doesn't have the necessary permissions to perform the request, and if that happens, we send a `401 Unauthorized` response with the `WWW-Authenticate: Basic` header, or a `403 Forbidden` if the user was actually authenticated but doesn't have the necessary permissions to perform the request on a _specific_ repo (e.g. on GitHub you can't push to someone else's repository, unless you were invited as a collaborator, giving you write permissions on that repository).

## Further reading

I really recommend reading through the git book and documentation on setting up `git-daemon` and `git-http-backend`, with an emphasis on the [`git-http-backend` documentation](https://git-scm.com/docs/git-http-backend), as that is what most of the code in this post was based upon.

## Where to go from here?

Now that a fair bit of the "core" git backend is done, it's time to start working on the web frontend.