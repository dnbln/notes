---
title: One year later...
date: 2024-02-25
---
One year ago, [[introduction-old|I introduced cargo-difftests for the first time]]. I don't believe I did the project justice the last time, writing a long post which contained a few too many commands. But I would like to change that, and to show how far it's come since.

So, without further ado, let's demonstrate what it's like to work with it now, and in what better way to do that than with an [asciinema](asciinema.org) cast?

<script async id="asciicast-642902" src="https://asciinema.org/a/642902.js"></script>

(The commands used are taken from [[cargo-difftests/usage]])

As you can see, rather than it spitting out [[introduction-old|endless JSON]], it can now do something with it without the need of helper binaries.

For most rust projects out there, where to run tests everything that is needed is just a simple `cargo test`, `cargo-difftests` now does most of the work.

## Rerun dirty action

There's now an accompanying repository, [cargo-difftests-rerun-dirty-action](https://github.com/dnbln/cargo-difftests-rerun-dirty-action), whose sole purpose is to have a GitHub action that would rerun the dirty tests given some git diff. It makes use (by default) of the `--algo=git-diff-files` [[cargo-difftests/algorithms|algorithm]]. The `cargo-difftests` repo uses this action to rerun dirty tests on pushes to `trunk` and PRs. It can be used to give faster feedback to contributors, but a full run of the test suite is always recommended. You use [this](https://github.com/dnbln/cargo-difftests/blob/trunk/.github/workflows/rerun-dirty-tests-index.yaml) as a template, should you want to.

### Curious now?

Feel free to give it a try. I would honestly love some feedback, as I have really few ideas on how to improve `cargo-difftests` further beyond where it is right now, so I would love to hear from you.

