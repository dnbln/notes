---
title: DFA definition
date: 2024-04-20
published: 2024-04-20
updated: 2024-04-20
tags:
  - agdomaton
growth-stage: seedling
---

Contains the DFA definition.

```agda
module Agdomaton.DfaDef where

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

open import Agdomaton.LogicBase

data State {n : ℕ} : Set where
  q : (Fin n) → State

data Symbol {n : ℕ} : Set where
  σ : (Fin n) → Symbol

record DFA
  {nq ns nf : ℕ}
  -- (Q : Vec (State {nq}) nq)
  -- (Σ : Vec (Symbol {ns}) ns)
  : Set where
  field
    δ : (State {nq} × Symbol {ns}) → State {nq}
    q₀ : State {nq}
    F : Vec (State {nq}) nf

fin-eq : {n : ℕ} → (Fin n) → (Fin n) → Bool
fin-eq zero zero = true
fin-eq zero (suc y) = false
fin-eq (suc x) zero = false
fin-eq (suc x) (suc y) = fin-eq x y

state-eq : {n : ℕ} → State {n} → State {n} → Bool
state-eq (q x) (q y) = fin-eq x y

elem-state : {nq n : ℕ} → (State {nq}) → Vec (State {nq}) n → Bool
elem-state x [] = false
elem-state x (y ∷ ys) = if (state-eq x y) then true else elem-state x ys

dfa-follow : {nq ns nf : ℕ} → (List (Symbol {ns})) → DFA {nq} {ns} {nf} → DFA {nq} {ns} {nf}
dfa-follow [] dfa = dfa
dfa-follow (s ∷ ss) dfa = dfa-follow ss (record dfa { q₀ = (DFA.δ dfa) ((DFA.q₀ dfa), s) })

dfa-accepts : {nq ns nf : ℕ} → (List (Symbol {ns})) → DFA {nq} {ns} {nf} → Bool
dfa-accepts ls dfa = let end-dfa = dfa-follow ls dfa in elem-state (DFA.q₀ end-dfa) (DFA.F end-dfa)
```
