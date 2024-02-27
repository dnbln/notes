---
title: Custom test harnesses
tags:
  - cargo-difftests
  - testing
---
In the cases where custom test harnesses are used, the test harnesses should behave in specific ways for `cargo-difftests` to be able to properly interact with them. Namely:
- The test harnesses must report the tests when invoked with `--list --format=terse`, in the same way as the default test harness: one per line, with the following format
```
<test_name>: test
```
- The test harnesses must run the test that it reported with name `test_name` above when using the following list of arguments:
```
--exact <test_name> --nocapture
```
