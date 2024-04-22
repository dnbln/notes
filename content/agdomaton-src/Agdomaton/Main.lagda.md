---
title: Main module
date: 2024-04-21
published: 2024-04-21
updated: 2024-04-21
tags:
  - agdomaton
growth-stage: seedling
---

## Import everything

```agda
module Agdomaton.Main where

open import Agdomaton.LogicBase
open import Agdomaton.DfaDef


open import Relation.Binary.PropositionalEquality using (_≡_; refl)
open import Data.Nat using (ℕ; zero; suc)
open import Data.Empty using (⊥; ⊥-elim)
open import Data.Sum using (_⊎_; inj₁; inj₂; [_,_])
open import Data.Product using (_×_; _,_; proj₁; proj₂)
open import Relation.Nullary using (¬_)
open import Axiom.Extensionality.Propositional using (Extensionality)
open import Data.List.Relation.Binary.Subset.Propositional.Properties
open import Relation.Unary using (Pred; _⊆_; _∈_)
open import Data.Fin.Base using (Fin; zero; suc)
open import Data.Vec using (Vec; _∷_; [])
open import Agda.Builtin.List using (List; _∷_; [])
open import Data.Bool.Base using (Bool; true; false; if_then_else_)
open import Agda.Primitive using (Set)

open import Agda.Builtin.IO using (IO)
open import Agda.Builtin.Unit using (⊤)
open import Agda.Builtin.String using (String)
```

## Test a basic DFA

```agda
2-length-counter-transition : (State {2} × Symbol {2}) → State {2}
2-length-counter-transition (q zero , _) = q (suc zero)
2-length-counter-transition (q (suc zero) , _) = q zero


2-length-counter : DFA {2} {2} {1}
  -- (q zero ∷ q (suc zero) ∷ [])
  -- (σ zero ∷ σ (suc zero) ∷ [])
2-length-counter = record
  { q₀ = q zero
  ; δ = 2-length-counter-transition
  ; F = q zero ∷ []
  }


test-dfa : Bool
test-dfa = dfa-accepts ((σ zero) ∷ (σ (suc zero)) ∷ []) 2-length-counter
```

## Define main

```agda
postulate putStrLn : String → IO ⊤
{-# FOREIGN GHC import qualified Data.Text as T #-}
{-# COMPILE GHC putStrLn = putStrLn . T.unpack #-}

show : Bool → String
show true = "true"
show false = "false"

main : IO ⊤
main = putStrLn (show test-dfa)
```
