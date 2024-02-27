---
title: "Upsilon part II: Hallo ssh"
date: 2023-01-20
tags:
  - upsilon
---
In the [[part-1-introduction|previous blog post]], I've went over how to implement a simple git server over HTTP.

After a lot more code (138 commits) and yet still not a single line of frontend, here we are again with another post about [upsilon](https://github.com/dnbln/upsilon), this time explaining how write a server to serve as a git remote, over the `ssh://` protocol.

## The age-old question: Why?

Well, `ssh://` is a very common protocol to serve git repositories, and although it is maybe not as common as `http(s)`, it is still quite handy and easy to use. For completeness' sake, I wanted to support it, and this was also a fantastic opportunity to learn how to actually write a `ssh` server.

As far as implementation details go, the `ssh` parts of the server are pretty similar to how the server handles the data-store, as in, there are some common operations that are shared between `ssh` servers, and swapping out the actual server implementation is as easy as changing a few configuration variables.

That being said, similar to the data-stores, there's also only one current implementation of it, which is based on [russh](https://github.com/warp-tech/russh). Using OpenSSH `sshd` for the server doesn't seem like that good of an idea, as authentication is a little harder to handle when we don't know who is who, thus giving the rise to our custom `ssh` server, and I really do hope I didn't introduce any major security flaws, due to my lack of prior knowledge of the details of the `ssh` protocol itself and how should it be used.

## How?

I'm glad you asked. Looking back on it, I would rank the `ssh` server as somewhere in between `git-daemon` (for the `git://` protocol) and `git-http-backend` (for the `http(s)://` protocol), in terms of difficulty and time required to implement. I didn't spend multiple days banging my head against the wall, asking why does the `git` client think the repository is corrupted, as I did when writing the `http` backend, but still learned quite a bit about `ssh` here... Well you actually learn more when things don't go right, am I right? But ssh had its own fair share of problems too, so let's get to it.

### First things first

The `ssh://` protocol is very different from `http://`, so a few basic thing first about how `git` over `ssh://` operates.

- In `ssh`, after all the preliminary checks have been performed (the client checking whether the server is in the `~/.ssh/known_hosts` list), the client authenticates itself (only allowed with ssh keys, no username / password or, god forbid, no authentication at all; if we would use no authentication at all we might as well just use the `git://` protocol, no point in bothering with `ssh://`, heck it even is faster!).
- After the client has authenticated itself, the `ssh` session is started, which will go on until the client disconnects.
- In this session, the client can open multiple channels, which are basically just streams of data (the server can open channels too, but for the purposes of `git` that should not happen, or otherwise the git client would be really surprised and confused).
- On this channel, the client can send some "requests", but for `git` only one of them is relevant: `exec`. This is also what happens when you pass a command to run when you connect with the plain `ssh` command ( e.g. `ssh hello@example.org echo 1`). The `exec` request is used to run a single command on a channel. The ssh server, when it receives one such request, spawns a shell (`sh -c '...'`) and runs the command inside it, piping `stdout` and `stderr` to the channel (to `data` and `extended_data` with `1` for `stdout` and `stderr` respectively), and piping from the channel (`data`) to the shell's `stdin`.
- On an `exec` request, the server should also send a `success` message, which is basically just a confirmation that the command was started successfully, or `failed` if it failed to start.
- The actual `git` commands that the `git` client sends are `git-upload-pack`, `git-receive-pack` and `git-upload-archive`, which are the commands that are used to fetch from, push to, and serve `git archive --remote` with a repository respectively. These commands are run on the channel that was opened by the client, and the server will respond with the appropriate data.
- Those commands are meant to be run inside `git-shell`. As it turns out, it is not available in git-for-windows, so the webserver just says "no" when we ask it to run a `ssh` server on windows.
- All the commands are "interactive"-ish, as in they all use `stdin` to do their job. This is why we need to pipe from the channel `data` to the shell's `stdin`, or otherwise they just will not work.
- After the client decides it is done, it sends an `eof` message, after which the server will close the `stdin` pipe, which the corresponding shell process (and thus the git command that was run in said shell process) will pick up on and finish up. After that, the server will go on and send the rest of the data that it has to send (`stdout` and `stderr`), and finally announce to the client the exit code of the command that was run.
- After that, the `git` client decides it is done, and so it closes the channel, closes the session, and disconnects.

### Actual implementation process

I've said above that I used [russh](https://github.com/warp-tech/russh) for the `ssh` server, which is a "fork" of [thrussh](https://pijul.org/thrussh) (if it can be considered one), both of which are pure-rust ssh server (~~and client, but that's besides the point~~) libraries.

The first thing I did was to figure out how to get the authentication bit right, and `russh` has [a very nice example](https://docs.rs/russh/0.35.0-beta.9/russh/server/index.html) for the server side of things.

After that, I had to figure out how to actually run the `git` commands, which proved to be a little harder on windows (due to the lack of `git-shell`), so I just gave up on ssh on windows for now.

Tests that use `ssh` are also ignored on windows, because of that, but running Ubuntu in WSL2 on windows is a good workaround for this currently.

The whole (current) implementation of the `russh` server is in the `upsilon-ssh-russh` crate.