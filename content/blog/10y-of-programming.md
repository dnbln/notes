---
title: Looking back on 10 years of programming
date: 2025-09-08
published: 2025-09-08
updated: 2025-09-08
growth-stage: seedling
---
With 2026 around the corner, it's soon going to be 10 years since I wrote my very first line of code, so I think

```poetry
It's a nice time to look back.
```

This 'blog' post is both a history of my programming journey, as well as a retrospective of the lessons I've learned since I first picked up programming, in a chronological order. If you want to skip to the lessons, [go here](#the-biggest-lessons).

## The journey

### The beginning, and middle school

```poetry
In the beginning, God created the heavens and the earth.
— Genesis 1:1
```

A few billion years later, a 6th grader (me) created their very first ‘Hello World’ program in C++.

In 7th grade (late 2016) I found a few tutorials on how to make games in Java with the `javax.swing` APIs, and I was hooked; I barely knew any English at the time, and I remember taking multiple weeks before I understood what `null` was and why the JVM was throwing `NullPointerException` when I was trying to access uninitialized arrays. Trying to understand code (and errors) is, in retrospective, probably the only reason I got to be fluent in English.

First, pong, the original, then a simplified version of snake, and then breakout, then space invaders, and then tetris. I've since lost the hard drive with most of my games from that time, nor did I know how to use `git` back then, so I didn't know how to save them on GitHub / GitLab / any other VCS hosting platform, and now they're lost forever, which I'm still a bit sad about :(.

Soon after that, I began diving into 3D graphics with OpenGL (and it's Java wrapper LWJGL), and I also discovered `git` around that time, leading to the first project that I still have the source code for right now.

It was a game I was making following along [ThinMatrix's amazing OpenGL tutorials](https://www.youtube.com/@ThinMatrix), around the same time as he was building [his Equilinox game](https://equilinox.com/), and following along with his devlogs, I attempted to make my own nature simulator game, which I literally called [`NatureSimulator`](https://github.com/dnbln/NatureSimulator).

Here is one of my own "devlogs," from 2018:

```
Day 14 (04.01.2018) - src = 192kb, shaders = 11.1kb
Added a delete button for the worlds witch deletes the save of the world witch's informations are currently shown and renames all the worlds saved as "save(i).dat" to "save(i-1).dat", where (current save data slot) < i <= (total number of saves)
Added specie info(cost, altitudes at witch the plant can live at(90 and -90 are the absolute limits, nothing can live above 90 or below -90)) inside the shop

Day 15 (05.01.2018) - src = 208kb, shaders = 11.7kb
Extended the entities.data infos with two booleans witch represent if the current BO(BiologicalOrganism) can move and jump
BO movement components, witch, given the BO's position, the world and the BO, changes the BO's position after checking if the BO is capable of performing that action(moving, jumping)
Show the current selected inventory item at (terrain height) + 5f in the world and a blue ring in the horizontal plane above the terrain where it will be if droped
Decreased biome spread distance for trees from 30 to 16
Multiple inventory items that represent the same object are now stacked and a little gray circle shows if there are 2 or more objects(the number is stored in inventory.InventoryItem.count), I will try to add a number writing the count in that circle

Day 16 (06.01.2018) - src = 210kb, shaders = 11.7kb
If the moving entity cannot be placed at a certain height, then the blue mark turns into an red "not able to place" mark
Didn't really do so much today

Day 17 (07.01.2018) - src = 215kb, shaders = 14.4kb
Changed the save file format, by adding a random number to the ASCII code of a character at encryption and subratcting that number from the int at decryption. Clever, isn't it? For the sake of speed of saving a world I'd better not change it again.
Rewrote a most of the water rendering code (and the shaders)

Day 18 (08.01.2018) - src = 217kb, shaders = 15.0kb
Allowed every entity to have up to 3 custom colors, every vertex having the color it was given to in Blender and 3 more color indicators, the first representing the custom color to use (0 for default color), and at witch component to add the offset represented in the third color indicator
To made this possible, I rewrote a lot of the OBJLoader to let an RawModel have different material colors and color indicators

Day 19 (09.01.2018) - src = 224kb, shaders = 15.1kb
Started to redo the models and add to them custom colors
The game save data contains now all the custom colors a BO has and all the MO(movement components) it has in order to restore the entity back at loading

Day 20 (10.01.2018) - src = 229kb, shaders = 15.4kb
Replaced the way the terrain changes biomes with a method 5 times faster that the old, altrough at the start of a new world it has to use to old load biomes function because it needs to completly rewrite the color VBO

Day 21 (11.01.2018) - src = 230kb (228260 chars), shaders = 15.5kb(15318 chars)
Now that blue circle put around the currently selected inventory item in the world bends to be at (terrain_height + 1f)
To make sure that entities cannot get to close to the lakes and the ocean, I've set their min_height to 2 from 0
Just played around with the HeightsGenerator and Terrain constants, now the terrain is 2x in size, and much more diverse than before

Onward:
@TODO Add the text in the gray circle representing the count for every inventory item
```

I don't even know why I was logging source sizes, nor why do that in kb instead of LoC or something a bit more meaningful, but anyway, that was a _long, very long_ time ago. Looking back on this, I realise how simple those ideas I thought were "clever" back then were, but hey, everyone's gotta start from somewhere.

Around that time, I was also reading a copy of ["Computer Science: a modern introduction", by Les Goldschlager and Andrew Lister](https://openlibrary.org/books/OL3781119M/Computer_science).

Their presentation of parse-trees just stuck with me, which leads us to my high school programming journey:

![[Pasted image 20250908030336.png]]

### High school

After graduating from middle school, and about 4 months into 9th grade, I found a new interest of mine for interpreters, trying to make sense of the stuff I have read from this book, for the first time creating a domain specific language (DSL) for update scripts in my previous project.

After finishing an interpreter for that DSL, I decided to try to make a _compiler_ for pseudo-code, or at the very least, the very structured pseudo-code that is taught in Romanian computer science classes, closer to a formally defined language than _pseudo_-code. And the cool part is that it worked, for most examples I tried.

It even had an assembly optimizer, which, because I didn't know how stuff was done in real optimizers, was just looking at assembly instructions, aggressively removing unnecessary ones, trying to move memory values into registers as much as possible; part of that is what LLVM and GCC also do, but I didn't know about their existence back then.

I've dabbled in a few more projects in high school, including:
- a C/C++ OpenGL / Vulkan game engine.[^vertexengine]
- a full C/C++ meta build system.[^leafbuild]
- a few other Rust projects.[^robespierre][^mdbook-snips][^lalrdoc][^ascii-image]
- a handful of IntelliJ plugins[^asms][^discordpanel][^intellijmeson][^intellijlalrpop][^jbdiscordint]
- a couple of server-specific Discord bots
- a few other utilities

[^vertexengine]: https://github.com/schctl/VertexEngine
[^leafbuild]: https://github.com/leafbuild/leafbuild
[^robespierre]: https://github.com/dnbln/robespierre, and https://github.com/dnbln/tui-revolt as a PoC TUI client powered by robespierre
[^mdbook-snips]: https://github.com/dnbln/mdbook-snips
[^lalrdoc]: https://github.com/dnbln/lalrdoc
[^ascii-image]: https://github.com/dnbln/ascii-image
[^asms]: https://github.com/dnbln/asms
[^intellijmeson]: https://github.com/IntellijMesonIntegration/IntellijMesonIntegration
[^discordpanel]: https://github.com/dnbln/DiscordPanel
[^intellijlalrpop]: https://github.com/AzureMarker/intellij-lalrpop
[^jbdiscordint]: https://github.com/Almighty-Alpaca/JetBrains-Discord-Integration

### B.Sc.

During my B.Sc., my first 'medium-sized' project was [a 3D-pong game](https://github.com/dnbln/cse-1400-assignment-8), fully[^game-impl-fully-assembly] implemented in x86_64 linux assembly, together w/ [@Zakrok09](https://github.com/Zakrok09).

[^game-impl-fully-assembly]: code written by us was 100% assembly, C needed in dependencies: `glad` (the OpenGL loader) and `glfw` (windowing library).

After that, I've begun working on my first major project during my studies: [upsilon], a fully self-hosted git hosting solution. Around that time, I've also begun blogging on here. The [[blog/upsilon/index|Upsilon blog]] might be interesting to take a look at. It gave rise to my 2nd major project: [cargo-difftests], which, as it happens, also has a blog [[blog/cargo-difftests/index|here]], and [[../../cargo-difftests/index|even documentation]].

[upsilon]:https://github.com/dnbln/upsilon
[cargo-difftests]: https://github.com/dnbln/cargo-difftests

Since 2023, I've also been working on [narxia], a programming language, on which I'm still working to this day.

[narxia]: https://github.com/dnbln/narxia 

In part, its development made me create a library to manage the complex directory hierarchy in the repository itself, and the core logic I've once again extracted into a separate library and published it on crates.io: [`dir-structure`][dir-structure].

[dir-structure]:https://crates.io/crates/dir-structure

I've finished my B.Sc. in Computer Science and Engineering at [TU Delft] in 2025.

[TU Delft]: https://tudelft.nl/en/

My [thesis](https://resolver.tudelft.nl/uuid:18b4b3ef-da6e-4bc8-8b2b-01f9a874a5d7) delved into formal verification in [SPARK](https://www.adacore.com/about-spark), the formally verifiable subset of Ada. I've had absolutely 0 experience with Ada prior to beginning the thesis project, but I was able to quickly ramp up.

### M.Sc.

I've just started my M.Sc. in Computer Science, also at [TU Delft].


## The biggest lessons

### Lesson #1
```poetry
You can't really appreciate the code someone else wrote
to solve a problem until you have to do it yourself
```


Some people make working on certain things look so easy, until you sit down and try to do what they're doing, and realize that you don't know how to go about it, or even where to start. It's an universal experience, but I think the important part is realizing that _everyone_ starts from _somewhere_.

```poetry
Everyone was a beginner once
at everything they look like an expert at now.
```

And as a short saying once said:

```poetry
Practice makes perfect.

Just because we're beginners
doesn't mean we should stop
trying to better ourselves.
```

<hr/>

### Lesson #2

```poetry
Dogfood your own tools, APIs, libraries, binaries, and only then
will you learn how to design APIs for those problem domains properly
```

[Dogfooding][Dogfood] is the art of testing your own products, as if you were their customer.

[Dogfood]:https://en.wikipedia.org/wiki/Eating_your_own_dog_food

I can't really describe how much I learned by doing this, and it's helped me create much more complete APIs for my libraries. While working on consumer code, you notice functionality that might have not even crossed your mind API consumers might need, and you end up refining your APIs, until there's nothing left you can think of.

To put it in perspective, 20% of the API surface of [`dir-structure`][dir-structure] wouldn't exist if I didn't try to use it for `narxia-workspace` and [`git-voyage`][git-voyage]. Over the span of the last 2 years, it has gone from 52 to 270 public items. One of the biggest improvements was adding support for virtual file systems (VFS), through which you can supply your own implementations of what it means to read a path, write to a path, list files in a directory etc. VFS's allowed for async implementations as well, so the crate now also exposes `ReadFromAsync`, `WriteToAsync`, and `WriteToAsyncRef`, which are the asynchronous equivalents of the synchronous `ReadFrom` and `WriteTo`.

Similarly, many features of [`cargo-difftests`][cargo-difftests] wouldn't exist if I didn't need to make them for [upsilon].

[git-voyage]: https://crates.io/crates/git-voyage

```poetry
Dogfooding should complement, not replace,
external testing and feedback.
```

<hr/>

### Lesson #3
```poetry
There are no shortcuts.
```

There are absolutely 0 shortcuts, you cannot just _download programming experience_, or we would all be experts. Some things you only learn by working on building things yourself, and if you get stuck somewhere first take some time to think, and then look at what other people did to solve similar problems.

This process is painstakingly slow, but it's the only way to build real problem solving skills; for better or for worse, those skills are *impossible to fake*.

You might be able to speed it up a little bit by learning how to find the right resources to solve a task, such as:
- mentors. Cause mentors are awesome 😎.
- learning how to Google code-related questions
- potentially learning how to ask ChatGPT code-related questions
- not being overly reliant on ChatGPT for fixing problems; it's a great tool, but relying on it too much is how "vibe code cleanup specialist" became a job title, when it never should have.

<hr/>

### Lesson #4

```poetry
If you want to go fast, go alone,
if you want to go far, go together.
```

There's a limit to how far a single engineer can go.

<hr/>

### Lesson #5

```poetry
Languages & frameworks matter less than transferable concepts.
```

After learning a couple of languages, you begin to see that they really are not that different from one another. All imperative languages look mostly the same, all functional languages look mostly the same, or at the very least, they all have similar patterns, within the same category.

Within the category of imperative, general-purpose programming languages, most of them do the same thing, just with different syntax, and some of them with slightly different rules on how to write code, to make sure they still operate efficiently while not dropping into undefined behaviour (Rust).

Once you realize that, it becomes more about how to express the *core* of an algorithm, with less of a focus on the language itself.

Let's take an example: If we go into the software engineering world, suppose 2 engineers had to implement the same HTTP backend, in the same language and with the same framework:

1. One of them has never worked with HTTP backends, and is otherwise completely new to web development, but knew the language very well otherwise.
2. One of them has never worked with the language, and has never been exposed to it, but knew how to write HTTP backends very well, as he has done that many times, with different frameworks in different languages.

Which one of them do you think is going to finish the job faster? It depends; specifically on the complexity of the HTTP backend itself, as well as the learning curves of the framework and the learning curve of the language.

- Sometimes the complexity of the HTTP backend / the learning curve of the framework would overwhelm the engineer who has never worked with HTTP, even if he knew the language in advance, giving a clear advantage to the engineer who has implemented multiple HTTP backends in other languages previously.
- Sometimes the learning curve of the language would overwhelm the engineer who has never worked with the language, even if he knew how to implement HTTP backends previously.

This leads us to a reflection:

```poetry
It's an understanding of the concepts,
and not so much just languages you know,
that is most important.
```

Building up this understanding of core concepts *requires* deliberate practice, but they are usually transferrable to other languages / frameworks.

Sure, knowing more languages can teach you the *core* concepts of programming (e.g. how to use a certain programming language to get it to do something you want), and similarly knowing how to use more HTTP frameworks can teach you the *core* concepts of HTTP backend development (e.g. how to use a certain framework to get it to do something you want), but once you understand those core concepts, you can apply them in any language and HTTP framework, with just a quick look at the documentation, which leads us to our final lesson.

<hr/>

### Lesson #6

```poetry
Programming is the art of telling computers what to do.
```

<hr/>

### Lesson ??? (Humorous)

```poetry
Management is the art of telling people what NOT to do.
```

[^mgmt]

[^mgmt]: Management is the art of guiding people by removing distractions, not micromanaging them—letting experts do their work is usually best. _Good_ management enables engineers to do _good_ things, while _bad_ management enables engineers to do _bad_ things.


## And what a journey its been...

If there's one common thread through all of my work, it's this:

```poetry
Curiosity is the thing that pushed me for the last 10 years.
Every time, it pushes me to go beyond my comfort zone,
just a little bit.

And looking back, that made all the difference.

Let your curious side go wild, and you'll go far.

Become who you are.
— Friedrich Nietzsche
```

And of course, always remember,
```poetry
So whether you eat or drink or whatever you do,
do it all for the glory of God.
— 1 Corinthians 10:31
```

<details>

<summary>
Given that those numbers are only going to grow bigger, here's a receipt of what I wrote in the last 10 years.
</summary>

`tokei` output on all of my repositories, excluding code that I didn't write:

```
===============================================================================
 Language            Files        Lines         Code     Comments       Blanks
===============================================================================
 Java                  672        45605        33872         5686         6047
 C Header               97        44426        41556         1930          940
 C                      27        27402        25269         1453          680
 Ada                   109        11142         6254         3377         1511
 SQL                    53         9428         8528          446          454
 Kotlin                104         5343         4220           65         1058
 Plain Text            122         4530            0         4413          117
 GNU Style Assembly     16         4383         3498           71          814
 C++                    59         4356         3556           85          715
 TeX                    19         4059         3980            0           79
 TOML                  164         3759         3043          124          592
 JavaScript             22         3624         2679          693          252
 Shell                  31         3219         2663          404          152
 GLSL                   88         2529         1994           25          510
 Sass                    5         1054          732          167          155
 TypeScript             28          983          686          213           84
 Assembly                3          915          850            9           56
 TSX                    23          885          754           54           77
 D                      28          506          342            0          164
 XML                     9          483          378           79           26
 Python                  6          427          354            8           65
 Batch                   7          380          291            0           89
 CSS                     8          351          292           21           38
 Nix                    13          350          280           21           49
 Go                      4          330          267            2           61
 Makefile               10          330          247           25           58
 GraphQL                 3          310          271            0           39
 CMake                   8          292          156           65           71
 SVG                     9          252          168           74           10
 AsciiDoc                4          201          167            0           34
 PSL Assertion           2           32           30            0            2
 Ruby                    1           27           19            1            7
 C++ Header              1           22           17            0            5
 Autoconf                1           12           12            0            0
 Pan                     1           12            6            2            4
 Dockerfile              1           11           10            0            1
 YAML                    2           10           10            0            0
 FEN                     1            1            1            0            0
 Fish                    1            1            1            0            0
-------------------------------------------------------------------------------
 Rust                  666       124383       103943         4259        16181
 |- Markdown           225         6298          529         4778          991
 (Total)                         130681       104472         9037        17172
-------------------------------------------------------------------------------
 HTML                  159        25586        19921           54         5611
 |- JavaScript           1           32           32            0            0
 (Total)                          25618        19953           54         5611
-------------------------------------------------------------------------------
 Markdown              221         9276            0         6626         2650
 |- Agda                 3          240          176           27           37
 |- BASH                21          168          153           10            5
 |- C                    1            3            3            0            0
 |- C++                  1          102           92            0           10
 |- GLSL                 1            5            5            0            0
 |- HTML                 1            4            4            0            0
 |- JSON                 2          310          310            0            0
 |- JSX                  1           12           11            0            1
 |- Rust                21         2385         1951          125          309
 |- Shell                4           12           12            0            0
 |- TOML                 7           70           58            6            6
 |- TSX                  3          260          237            6           17
 |- TypeScript           9          265          251            9            5
 |- YAML                 1           81           73            0            8
 (Total)                          13193         3336         6809         3048
-------------------------------------------------------------------------------
 Svelte                 19          607          317          240           50
 |- CSS                  8          383          328            1           54
 |- JavaScript          16          287          207           24           56
 (Total)                           1277          852          265          160
===============================================================================
 Total                2828       341834       271634        30692        39508
===============================================================================
```
</details>
 
