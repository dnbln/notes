---
title: "Upsilon part III: upsilon difftests"
date: 2023-02-08
tags:
  - testing
  - upsilon
---
In [[part-2-git-over-ssh|the previous blog post]], I've gone over how to setup git over ssh. In this blog post, I'm gonna do a 180 and talk about something unrelated (at least not directly) to git, but quite important to get right early in a project: testing.

Having the tests take a while to run is not fun, especially with a large testsuite. So, I decided to add a `quick`, on-by-default, option to `xtask test`, and in this post I would like to give an overview of how it works.

From the title, you might take a guess on how it works... I'll give you a second... yep, it uses [instrumentation-based code coverage](https://doc.rust-lang.org/rustc/instrument-coverage.html), looking through the diffs in the worktree (diff from `HEAD..worktree`), and figuring out which code that the test invokes has been modified, or other inputs to the test have changed.

## The yet-even-older-now question: How?

This is implemented in 2 parts:

- Get the coverage data from the tests
- Use the coverage data to determine which tests are "dirty"

But, a few things we'll need first:

### Dependencies

#### `cargo-binutils`

We'll need [cargo-binutils](https://github.com/rust-embedded/cargo-binutils). It basically gives us a few commands to be able to invoke the llvm tools distributed with `rustc`. Let's install them:

```bash
rustup component add llvm-tools-preview
cargo install cargo-binutils
```

### Get the coverage data from the tests

If you're not familiar with instrumentation-based code coverage, I'd recommend you read the [instrumentation-based code coverage](https://doc.rust-lang.org/rustc/instrument-coverage.html) page from the `rustc` book.

NOTE

For the instrumentation to work and get one `.profraw` file per test, instead of one per test binary, we need to run the tests individually. `cargo nextest` does this by default, but extra care needs to be taken when running the tests with `cargo test`.

To get started, let's create a new cargo profile:

```toml
# .cargo/config.toml
[profile.difftests]
inherits = "dev"
rustflags = [
	"-C", "instrument-coverage",
	"--cfg", "difftests",
]
```

Then, at the beginning of every `#[test]` function:

```rust
#[cfg(difftests)]
fn difftests_init(tempdir: &Path, test_name: &str) -> std::io::Result<()> {
	// to handle tests that spawn children that also need to be instrumented
	extern "C" {
		// we can call this function to set the filename of the .profraw file
		// that will be generated at the end of the program.
		fn __llvm_profile_set_filename(filename: *const std::ffi::c_char);
	}
	if tempdir.exists() {
        std::fs::remove_dir_all(tempdir)?;
    }
    std::fs::create_dir_all(tempdir)?;
    let self_profraw = tempdir.join("self.profraw");
    let self_profile_file_str = self_profraw.to_str().unwrap();
    let self_profile_file_str_c = std::ffi::CString::new(self_profile_file_str).unwrap();
    unsafe {
	    __llvm_profile_set_filename(self_profile_file_str_c.as_ptr());
    }
    // this will set the variable for children processes, so that they
    // can also write to some file in the tempdir.
    let profraw_path = tempdir.join("%m_%p.profraw");
    std::env::set_var("LLVM_PROFILE_FILE", profraw_path);
    // recommended: also store `std::env::current_exe()`:
    let exe = std::env::current_exe().unwrap();
    std::fs::write(tempdir.join("self_exe"), &exe)?;
    // and test_name:
    std::fs::write(tempdir.join("test_name"), test_name)?;
    Ok(())
}

#[cfg(not(difftests))]
fn difftests_init(_tempdir: &Path, _test_name: &str) -> std::io::Result<()> {
	Ok(())
}

#[test]
fn test_something() {
	let test_name = "test_something";
	let tempdir = PathBuf::from(env!("CARGO_TARGET_TMPDIR")).join(test_name);
	// `CARGO_TARGET_TMPDIR` is set by cargo, and is a temporary directory
	// where integration tests can store their data. It is not cleaned up,
	// cargo just creates it and leaves it to us to manage it.
	// In unit tests you can some other temporary directories, but we will
	// need the outputs stored in this dir after the test is over, so do not
	// perform any cleanup on it!
	difftests_init(&tempdir, test_name).unwrap();
	// do the test
}
```

Now, if we run:

```bash
cargo test --profile difftests
```

NOTE

It is crucial that the test doesn't `abort` / call `std::process::exit` or other similar actions, as they will prevent the `.profraw` file from being written.

We should get a `target/tmp/test_something` directory, filled with a few `.profraw` files (from the children), and a `self.profraw` file for the test itself, among the other files we initialized.

We can now convert those `.profraw` files to a `.profdata` file, which is a format `llvm-cov` can work with:

```bash
rust-profdata merge -sparse \
target/tmp/test_something/*.profraw \
-o target/tmp/test_something/test_something.profdata
```

Now, after we have the `.profdata` file, we can use `llvm-cov` to get the coverage data:

```bash
rust-cov export \
-instr-profile=target/tmp/test_something/test_something.profdata \
"$(cat target/tmp/test_something/self_exe)" \
> target/tmp/test_something/test_something.json
```

After that, it is only a question of what we want to do with the data, which brings us to the next section.

## Use the coverage data to determine which tests are "dirty"

For this, we will need to figure out which tests are "dirty".

### What is a "dirty" test?

For the purposes of this, we shall call a test "dirty" if the source code that is run during the execution of the test has changed, or if any of its inputs have changed.

We will assume that all tests are fully deterministic based on those things alone.

### How to determine if a test is "dirty"?

#### File system mtimes

One could achieve this through many ways, but perhaps the easiest is to use file system mtimes. We can get the mtime of the `self_exe` file, to determine when the test was last run, and compare it to the mtime of all the source / input files that the test used.

For source files, that is easy: just find the regions that have the execution count > 0, and get the mtime of those, then compare it with the time we last ran the test.

For input files, this is a little bit trickier, and you will have to determine how to do it for your specific use case.

For large source files used by many tests, this might cause many tests to be considered "dirty", sometimes unnecessarily, so we can try to be a bit smarter here.

#### `git diff HEAD`

Another way to do this is to use `git diff HEAD` (through `libgit2` APIs of course), which will show us the changes to the worktree since the last commit.

We need a few assumptions:

1. The instrumented tests are run only right after the last commit, in a clean worktree.
2. Normal tests are run otherwise.

This is a bit more complicated, but it is more accurate when those conditions hold. We can then use the diff from the last commit to determine the changes that were made to the source files, and then we can use the coverage data to determine which tests are affected by those changes.

This is just a bird's eye view of how this can be done, and it is not necessarily the best way to do it, but it is a good starting point.

If you would like to see my current (~~incomplete~~) implementation of this, feel free to check out the [`dev/upsilon-difftests*` crates](https://github.com/dnbln/upsilon/tree/trunk/dev).

Edit (2024-02-25): This was the precursor to [[cargo-difftests/index|cargo-difftests]].