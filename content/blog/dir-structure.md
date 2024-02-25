---
title: Introducing dir-structure
date: 2023-09-27
---
TL;DR: A simple crate to read and write directory structures.

## Motivation

There were a few times when I needed to read or write a directory structure, but I didn't want to use the `std::fs` API directly. If you think about it, it is pretty simple to read, parse and write directory structures, so I went through a lot of crates on `crates.io` that referenced directories, but I didn't really find anything that would do this. So I've decided to write my own.

This blog post serves both as a guide to getting started with `dir-structure`, as well as a bit of documentation on the crate itself.

## Getting started

The crate is available on `crates.io`, so you can just add it to your `Cargo.toml`:

```toml
[dependencies]
dir-structure = "0.1"
```

But before being able to use it, we need to first think of what kind of directory structure we want to model. The particular use case I had in mind was a directory, filled with many other subdirectories, each containing 2 files: `input.txt` and `output.txt`, which would later be used for testing purposes (via a crate like `libtest-mimic` for example), but the directory structure part can be applied to many other use cases.

So an example `tree` would look like this:

```
root
├───assignment
│       input.txt
│       output.txt
│
├───block_with_semis
│       input.txt
│       output.txt
│
├───call_with_lambdas
│       input.txt
│       output.txt
│
└───fn
        input.txt
        output.txt
```

We can model it with a simple:

```rust
#[derive(dir_structure::DirStructure)]
struct Dir {
    // a more advanced example will follow, but
    // for now we will model it with compile-time
    // known directories.

    // Notice how nested directories are also supported.
    assignment: InnerDir,
    block_with_semis: InnerDir,
    call_with_lambdas: InnerDir,
    r#fn: InnerDir,
}

#[derive(dir_structure::DirStructure)]
struct InnerDir {
    #[dir_structure(path = "input.txt")]
    input: String,
    #[dir_structure(path = "output.txt")]
    output: String,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    use dir_structure::DirStructureItem;
    let path = std::path::Path::new("root");
    let dir = Dir::read(path)?;

    // and now we can access the fields of Dir as they were loaded above.
    println!("assignment: {} -> {}", dir.assignment.input, dir.assignment.output);
    println!("block_with_semis: {} -> {}", dir.block_with_semis.input, dir.block_with_semis.output);
    println!("call_with_lambdas: {} -> {}", dir.call_with_lambdas.input, dir.call_with_lambdas.output);
    println!("fn: {} -> {}", dir.r#fn.input, dir.r#fn.output);

    // We can even modify them, and then write back the result.
    dir.assignment.input = "new input".to_string();
    dir.assignment.output = "new output".to_string();
    dir.write(path)?;

    Ok(())
}
```

## Advanced usage

### Non-compile-time known directories

In the example above, we knew that the `root` directory always had the same 4 subdirectories, but what if we didn't know that? What if we wanted to read a directory structure that had an arbitrary number of subdirectories, but their contents all shared the same structure?

Well, we can do that really easily too:

```rust
#[derive(dir_structure::DirStructure)]
struct Dir {
    #[dir_structure(path = self)] // will pass the path of the current
                            // directory to the function responsible for reading
    inner_dirs: dir_structure::DirChildren<InnerDir>,
}

#[derive(dir_structure::DirStructure)]
struct InnerDir {
    #[dir_structure(path = "input.txt")]
    input: String,
    #[dir_structure(path = "output.txt")]
    output: String,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    use dir_structure::DirStructureItem;
    let path = std::path::Path::new("root");
    let dir = Dir::read(path)?;

    // and now we can access the fields of Dir as they were loaded above.
    for inner_dir in dir.inner_dirs.iter() {
        // do something with the inner_dir
        let name: &std::ffi::OsString = inner_dir.file_name();
        let InnerDir { input, output } = inner_dir.value();
        println!("{:?}: {} -> {}", name, input, output);
    }

    Ok(())
}
```

Since by default the `DirStructure` derive macro will use a child directory with the name of the field, we have to explicitly tell it that we want to use the current directory instead. We can do that by adding the `#[dir_structure(path = self)]` attribute.

### Lazy reading of directory contents

In the examples above, we read the directory structure immediately, but what if we had so much data that we didn't want to read it all at once? Well, the library also provides a `DeferredRead<T>` type, which only stores the path, and will read the value later when we explicitly ask it to.

```rust
#[derive(dir_structure::DirStructure)]
struct Dir {
    #[dir_structure(path = self)]
    inner_dirs: dir_structure::DirChildren<InnerDir>,
}

#[derive(dir_structure::DirStructure)]
struct InnerDir {
    // the DeferredRead type is generic over T, so we can use it
    // for any type that can be read from a file.
    #[dir_structure(path = "input.txt")]
    input: dir_structure::DeferredRead<String>,
    #[dir_structure(path = "output.txt")]
    output: dir_structure::DeferredRead<String>,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    use dir_structure::DirStructureItem;
    let path = std::path::Path::new("root");
    let dir = Dir::read(path)?;

    for inner_dir in dir.inner_dirs.iter() {
        let name: &std::ffi::OsString = inner_dir.file_name();
        let InnerDir { input, output } = inner_dir.value();
        let real_input: String =
            input.perform_read()?; // actually performs the read
        let real_output: String = output.perform_read()?;
        println!("{:?}: {} -> {}", name, real_input, real_output);
    }

    Ok(())
}
```

In this example however, we have to explicitly call `perform_read` on the `DeferredRead` values, which is a bit annoying, as it does no caching of the values. So if we wanted to read the same value multiple times, we would have to call `perform_read` multiple times, which would be inefficient. We will explore an alternative in the next section.

### Lazy and cached reading of directory contents

In the previous example, we had to explicitly call `perform_read` on the `DeferredRead`, but if we have to read it multiple times, it would be inefficient. So we can use the `DeferredReadOrOwn<T>` type, which is also able to cache the value, so that we don't have to read it multiple times.

```rust
#[derive(dir_structure::DirStructure)]
struct Dir {
    #[dir_structure(path = self)]
    inner_dirs: dir_structure::DirChildren<InnerDir>,
}

#[derive(dir_structure::DirStructure)]
struct InnerDir {
    // DeferredReadOrOwn<T> will defer the read until we call
    // either `get()` or `perform_and_store_read()` on it.
    #[dir_structure(path = "input.txt")]
    input: dir_structure::DeferredReadOrOwn<String>,
    #[dir_structure(path = "output.txt")]
    output: dir_structure::DeferredReadOrOwn<String>,
}
```

In a nutshell, here is the API:

```rust
#[derive(Debug, Clone, Hash)]
pub enum DeferredReadOrOwn<T>
where
    T: ReadFrom,
{
    Own(T),
    Deferred(DeferredRead<T>),
}

impl<T> DeferredReadOrOwn<T>
where
    T: ReadFrom,
{
    /// Gets the value. If it is not already read, it will read it,
    /// but without saving it.
    pub fn get(&self) -> Result<T>
    where
        T: Clone, // do note that if T is not Clone, we won't be able to
                  // Clone the value if we have already read it.
    {
        // ...
    }

    /// Performs the read and stores the value. If the value is already read,
    /// it will just return a reference to it.
    pub fn perform_and_store_read(&mut self) -> Result<&T> {
        // ...
    }
}
```

### Reading / writing JSON

With the `json` feature, we can also read and write JSON files using `serde_json`.

```toml
[dependencies]
dir-structure = { version = "0.1", features = ["json"] }
serde = { version = "1", features = ["derive"] }
```

```rust
#[derive(dir_structure::DirStructure)]
struct Dir {
    #[dir_structure(path = "f.json")]
    f: dir_structure::json::Json<F>,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
struct F {
    a: String,
    b: String,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    use dir_structure::DirStructureItem;
    let path = std::path::Path::new("root");
    let dir = Dir::read(path)?;

    let f: &F = &dir.f.0;
    println!("f: {:?}", f);

    let new_f = F {
        a: "new a".to_string(),
        b: "new b".to_string(),
    };
    dir.f.0 = new_f;
    dir.write(path)?;

    // now `f.json` contains the JSON of the `new_f` value.

    Ok(())
}
```

## Library internals

The whole library works with 2 building-block traits: `ReadFrom` and `WriteTo`.

```rust
pub trait ReadFrom {
    fn read_from(path: &Path) -> Result<Self>
    where
        Self: Sized;
}

pub trait WriteTo {
    fn write_to(&self, path: &Path) -> Result<()>;
}
```

The `ReadFrom` trait is implemented for types that can be read from a path, while the `WriteTo` trait is the opposite of that, and is implemented for types that can be written to a path.

They are both implemented for types that represent whole directory structures, as well as for types that represent individual files.

Directory structures are read and written recursively, so if we had a directory structure like in the beginning:

```
root
├───assignment
│       input.txt
│       output.txt
│
├───block_with_semis
│       input.txt
│       output.txt
│
├───call_with_lambdas
│       input.txt
│       output.txt
│
└───fn
        input.txt
        output.txt
```

The derive macro for `Dir` and `InnerDir` at the very beginning of this post would generate something along the lines of:

```rust
struct Dir {
    assignment: InnerDir,
    block_with_semis: InnerDir,
    call_with_lambdas: InnerDir,
    r#fn: InnerDir,
}

impl ReadFrom for Dir {
    fn read_from(&self, path: &std::path::Path) -> dir_structure::Result<Self> {
        let assignment = InnerDir::read_from(&path.join("assignment"))?;
        let block_with_semis = InnerDir::read_from(&path.join("block_with_semis"))?;
        let call_with_lambdas = InnerDir::read_from(&path.join("call_with_lambdas"))?;
        let r#fn = InnerDir::read_from(&path.join("fn"))?;
        Ok(Self {
            assignment,
            block_with_semis,
            call_with_lambdas,
            r#fn,
        })
    }
}

impl WriteTo for Dir {
    fn write_to(&self, path: &std::path::Path) -> dir_structure::Result<()> {
        self.assignment.write_to(&path.join("assignment"))?;
        self.block_with_semis.write_to(&path.join("block_with_semis"))?;
        self.call_with_lambdas.write_to(&path.join("call_with_lambdas"))?;
        self.r#fn.write_to(&path.join("fn"))?;
        Ok(())
    }
}

impl DirStructure for Dir {}

struct InnerDir {
    input: String,
    output: String,
}

impl ReadFrom for InnerDir {
    fn read_from(&self, path: &std::path::Path) -> dir_structure::Result<Self> {
        let input = String::read_from(&path.join("input.txt"))?;
        let output = String::read_from(&path.join("output.txt"))?;
        Ok(Self { input, output })
    }
}

impl WriteTo for InnerDir {
    fn write_to(&self, path: &std::path::Path) -> dir_structure::Result<()> {
        self.input.write_to(&path.join("input.txt"))?;
        self.output.write_to(&path.join("output.txt"))?;
        Ok(())
    }
}

impl DirStructure for InnerDir {}
```

`ReadFrom` and `WriteTo` are really simple traits, and they are implemented for the following types:

- `String`
- `Vec<u8>`
- [`FmtWrapper<T> where T: std::fmt::Display + std::str::FromStr`](#fmtwrapper)

### `FmtWrapper`

The `FmtWrapper<T>` type is a newtype around `T`, which implements `ReadFrom` and `WriteTo` using `std::fmt::Display` and `std::str::FromStr`.

It can be used like this:

```rust
#[derive(dir_structure::DirStructure)]
struct Dir {
    // with_newtype = FmtWrapper<u32> basically says that we want to use
    // FmtWrapper<u32> instead of u32 for reading and writing, and then
    // use a few conversion functions to convert to and from FmtWrapper<u32>.
    #[dir_structure(with_newtype = FmtWrapper<u32>)]
    a: u32,
    #[dir_structure(with_newtype = FmtWrapper<u32>)]
    b: u32,
}
```

### `#[dir_structure(with_newtype = T)]`

The specific traits involved in the conversions are:

```rust
pub trait NewtypeToInner {
    type Inner;

    fn into_inner(self) -> Self::Inner;
}

pub trait FromRefForWriter<'a> {
    /// The inner type to cast.
    type Inner: ?Sized;
    /// The reference type to cast to.
    type Wr: WriteTo + 'a;

    /// Casts the reference to the inner type to a [`WriteTo`]
    /// reference type.
    fn from_ref_for_writer(value: &'a Self::Inner) -> Self::Wr;
}
```

`NewtypeToInner` is pretty much straight-forward, but `FromRefForWriter` is a bit more complicated. It is used to convert a reference to the inner type to a type that holds said reference and implements `WriteTo`. Essentially it is a newtype around `&'a Self::Inner` which implements `WriteTo`.

Both of those functions are used when we use a `with_newtype` attribute on a field.

In the general case:

```rust
#[derive(dir_structure::DirStructure)]
struct Dir {
    #[dir_structure(with_newtype = T)]
    field: U,
}
```

The following bounds must be satisfied for the `with_newtype` attribute to work:

- `T: NewtypeToInner<Inner = U>`
- `T: for<'a> FromRefForWriter<'a, Inner = U>`