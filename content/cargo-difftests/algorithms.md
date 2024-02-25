---
title: Algorithms
---
There are multiple ways to tell whether a change to a file will impact the result of a test.

#### `fs-mtime`

The most basic way is to check the `mtime` of the files which included executed code, comparing it with the time we ran the test. This works well in most cases, especially during development when files are very often edited, and is the default.

#### `git-diff-files`

Basically the same thing, but we assume that the last full test run was at the last commit (good for CI), and we compare the trees between the last commit and the current state of the tree to check which files have changed.

Also supports comparing with a given commit instead of the last, but it should be passed as the
`--commit` option.

>[!danger]
> **Caution:** Running tests with a dirty working tree may cause problems. As such, it is recommended to only use this on CI to tell developers quickly about the results of the most-likely-affected tests, but while actually working it would be wise to just use `fs-mtime`.

#### `git-diff-hunks`

This one expands on the `git-diff-files` algorithm, but here, instead of checking if the file was touched since the last commit, we check only for the specific parts of the file that were modified. This works because git actually keeps track of individual lines for us.

Also similarly to `git-diff-files`, this algorithm also accepts an optional `--commit`, with which to compare instead of the last commit.


>[!danger]
> **Caution:** Running tests with a dirty working tree may cause problems. As such, it is recommended to only use this on CI to tell developers quickly about the results of the most-likely-affected tests, but while actually working it would be wise to just use `fs-mtime`.
