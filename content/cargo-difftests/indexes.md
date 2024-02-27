---
title: Test indexes
tags:
  - cargo-difftests
  - testing
---
Test indexes are a light-weight representation of the actual coverage data `cargo-difftests` gets from LLVM. Note that they are different from LLVM's notion of an _indexed_ `.profraw` file (e.g. a `.profdata` file).

They are typically self-contained, and by default only contain the list of file names that had at least a bit of code run during the execution of the test, when the test was run, and a bit of information about the test.

## Full indexes

They can, however, be expanded to contain region information, to use, for example, with the [[algorithms#`git-diff-hunks`|git-diff-hunks algorithm]], by passing the `--full-index` option to whichever `cargo-difftests` subcommand was used to compile the index.

