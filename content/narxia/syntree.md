---
title: syntree
description: An abstract representation of syntax trees
tags:
  - narxia
growth-stage: seedling
date: 2024-04-02
published: 2024-04-02
updated: 2024-04-10
---
The syntax tree (or syntree for short), is a tree structure representing the source code. This particular representation is backed by [`rowan`](https://crates.io/crates/rowan) trees. Given that `rowan` trees are untyped, the `narxia_syn::syntree` module defines a typed interface over the `rowan`  Nodes. This representation is quickly turned into [[hir|High-level Intermediate Representation]] during [[hir#HIR lowering|HIR lowering]].