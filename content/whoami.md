---
title: Whoami
date: 2024-04-13
published: 2024-04-13
updated: 2024-04-13
---

My name is Dinu Blanovschi, and currently I'm pursuing my bachelor in Computer Science and Engineering at the [Delft University of Technology][TU Delft] in the Netherlands.

I've followed the systems variant in my 2nd year, which consisted of the courses:
- Digital Systems
- Embedded Software
- Operating Systems 

I've been programming as a hobby for quite a long time now. Most of my projects are open-source, and available on [my GitHub](https://github.com/dnbln).

## Project list

Here follows a list of my open-source projects, in a backwards-chronological-ish order:

- [narxia](https://github.com/dnbln/narxia) (2023-Present): a programming language. See also: [[narxia/index|the narxia documentation]].
- [ColentinaAI](https://github.com/JetbrainsColentinaTei/ColentinaAI) (2024): An IntelliJ plugin that acts as an AI companion, and helps students solve programming questions. Developed for the JetBrains Academy AIFest 2024 hackathon, which won 2nd place.
- [cargo-difftests](https://github.com/dnbln/cargo-difftests) (2023-2024): a selective re-test framework for [Rust]. See also: [[cargo-difftests/index|the cargo-difftests documentation]] and [[blog/cargo-difftests/index|the cargo-difftests blog]].
- [dir-structure](https://github.com/dnbln/narxia/tree/trunk/dev/dir-structure) (2023): A [Rust] library that allows for easy manipulation of file-system directories, with little boilerplate.
- [abfc](https://github.com/dnbln/abfc) (2023): An optimizing, hand-written assembly brainfuck compiler.
- [upsilon](https://github.com/dnbln/upsilon) (2022-2023): A self-hosted git provider, written in Rust. See also: [[blog/upsilon/index|the upsilon blog]].
- [klanx](https://github.com/dnbln/klanx) (2022): A toy compiler project, which was also the first time I used [LLVM] directly.
- [asms](https://github.com/dnbln/asms) (2022): A plugin for IntelliJ for helping write AT&T syntax, GNU `as` assembly.
- [tui-revolt](https://github.com/dnbln/tui-revolt) (2021): A TUI client for [Revolt], powered by `robespierre`.
- [robespierre](https://github.com/dnbln/robespierre) (2021): A full library for writing [Revolt] bots with [Rust].
- [jmex](https://github.com/dnbln/jmex) (2021): A binary for manipulating JSON, kind of similar to `jq`.
- [mdbook-snips](https://github.com/dnbln/mdbook-snips) (2021): A [mdBook] plugin which marks hidden lines in a [mdBook] with `// --snip--` or similar comment.
- [nb-rs](https://github.com/dnbln/nb-rs) (2021): [https://nekos.best/](https://nekos.best/) API wrapper for [Rust].
- [DiscordPanel](https://github.com/dnbln/DiscordPanel) (2020-2021): An IntelliJ plugin that embeds the web version of Discord in a tool window in IntelliJ via JCEF, intended to make testing bots faster.
- [lalrdoc](https://github.com/dnbln/lalrdoc) (2021): Extracts a syntax reference from a [lalrpop] grammar and renders it as a [mdBook].
- [eduhack](https://github.com/dnbln/eduhack) (2020): A web service to host educational content, developed during the 2020 edition of the EduHack hackathon.
- [ascii-image](https://github.com/dnbln/ascii-image) (2020): A program that turns an image into "ascii" art, with Braille characters.
- [leafbuild](https://github.com/leafbuild/leafbuild) (2020): A C/C++ build system.
- [IntelliJMesonIntegration](https://github.com/IntellijMesonIntegration/IntellijMesonIntegration) (2020): An IntelliJ plugin that integrates [CLion] with the [Meson build system](https://mesonbuild.com/).
- [twdiff](https://github.com/dnbln/twdiff) (2020): Code plagiarism checker. Works by computing a "similarity" between 2 different source files, based on how similar they are *structurally*.
- [PseudoLangCompiler](https://github.com/dnbln/PseudoLangCompiler) (2019): My first ever compiler, which I have [rewritten later in C](https://github.com/dnbln/PSEUDO_LANG_COMPILER_C) (2019).
- [NatureSimulator](https://github.com/dnbln/NatureSimulator) (2017-2019): A full game (and engine) made following [ThinMatrix](https://www.youtube.com/@ThinMatrix)'s amazing [OpenGL 3D game tutorials](https://www.youtube.com/watch?v=VS8wlS9hF8E&list=PLRIWtICgwaX0u7Rf9zkZhLoLuZVfUksDP&index=1), and inspired by his [Equilinox game](https://equilinox.com/). I've [later tried to rewrite it in C++](https://github.com/dnbln/NS_CPP) (2019), but the rewrite never reached feature-parity with the original Java version.

## Contributions to other open source projects

Some projects where I contributed with new features:

- I've contributed to the [Rust] project, specifically in:
	- [cargo]: [Reasons for rebuilding](https://github.com/rust-lang/cargo/pull/11407): displays why [cargo] decided to rebuild the given crate, when passed the `--verbose` flag.
	- [clippy]: [Add unused_enumerate_index lint](https://github.com/rust-lang/rust-clippy/pull/10404): lint for `for (_, x) in iter.enumerate()` in [Rust] code.
- [intellij-lalrpop][intellij-lalrpop plugin] ([Repository][intellij-lalrpop repo]): An IntelliJ plugin for [lalrpop].
	- [Lots of quality-of-life improvements](https://github.com/AzureMarker/intellij-lalrpop/pulls?q=is%3Apr+author%3Adnbln).
- [JetBrains-Discord-Integration](https://github.com/Almighty-Alpaca/JetBrains-Discord-Integration): Discord rich presence integration for all JetBrains IDEs.
	- [Implement templates for custom fields](https://github.com/Almighty-Alpaca/JetBrains-Discord-Integration/pull/108): Implemented basic templating for custom fields, to be able to customize the text shown in Discord.

[mdBook]: https://github.com/rust-lang/mdBook
[Revolt]: https://revolt.chat
[LLVM]: https://llvm.org/
[Rust]: https://rust-lang.org/
[TU Delft]: https://tudelft.nl 
[cargo]: https://github.com/rust-lang/cargo
[clippy]: https://github.com/rust-lang/rust-clippy
[CLion]: https://jetbrains.com/clion 
[intellij-lalrpop plugin]: https://plugins.jetbrains.com/plugin/15229-lalrpop
[intellij-lalrpop repo]: https://github.com/AzureMarker/intellij-lalrpop
[lalrpop]: https://github.com/lalrpop/lalrpop