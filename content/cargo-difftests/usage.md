---
title: Usage
tags:
  - cargo-difftests
  - testing
---
As is stated in the [`cargo-difftests` README](https://github.com/dnbln/cargo-difftests/blob/trunk/README.md), one could simply use `cargo-difftests` like so:

```bash
% # collect profiling data
% cargo difftests collect-profiling-data
% touch src/advanced_arithmetic.rs # change mtime
% cargo difftests analyze --dir target/tmp/difftests/tests/test_add
clean
% cargo difftests analyze --dir target/tmp/difftests/tests/test_mul
dirty
% cargo difftests analyze --dir target/tmp/difftests/tests/test_div
dirty
% cargo difftests collect-profiling-data --filter test_mul --exact
% cargo difftests analyze --dir target/tmp/difftests/tests/test_mul
clean
% cargo difftests analyze --dir target/tmp/difftests/tests/test_div
dirty
% cargo difftests collect-profiling-data --filter test_div --exact
% cargo difftests analyze --dir target/tmp/difftests/tests/test_div
clean
```

## Recommended workflow

### Initial profiling data collection

```bash
cargo difftests collect-profiling-data --compile-index --index-root=difftests-index-root --root=target/tmp/difftests
```

### Analyze, rerun and collect new profiling data

```bash
CARGO_DIFFTESTS_EXTRA_ARGS='--compile-index,--index-root=difftests-index-root,--root=target/tmp/difftests' cargo difftests rerun-dirty-from-indexes --index-root=difftests-index-root
```

`cargo difftests rerun-dirty-from-indexes` is basically an alias for `cargo difftests analyze-all-from-index --action=rerun-dirty`; more information about `analyze-all` can be found in [the analyze-all article](analyze-all.md).

The `--compile-index` tells `cargo-difftests` to compile [[indexes]]. You can optionally pass `--and-clean` next to `--compile-index` to have `cargo-difftests` clean up all the profiling data other than the index after it's done running a test, to reduce the amount of required disk space.
