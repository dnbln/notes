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

## Imports

```agda
module Agdomaton.DfaDef where

open import Relation.Binary.PropositionalEquality using (_≡_; refl)
open import Data.Nat using (ℕ; zero; suc; _≤_; s≤s)
open import Data.Empty using (⊥; ⊥-elim)
open import Data.Sum using (_⊎_; inj₁; inj₂; [_,_])
open import Data.Product using (_×_; _,_; proj₁; proj₂)
open import Relation.Nullary using (¬_)
open import Axiom.Extensionality.Propositional using (Extensionality)
open import Data.List.Relation.Binary.Subset.Propositional.Properties
open import Relation.Unary using (Pred; _⊆_; _∈_)
open import Data.Fin.Base using (Fin; zero; suc; fromℕ; fromℕ<)
open import Data.Vec using (Vec; _∷_; []; map)
open import Agda.Builtin.List using (List; _∷_; [])
open import Data.Bool.Base using (Bool; _∧_; true; false; if_then_else_)
open import Agda.Primitive using (Set; Level; lzero; lsuc)

open import Agdomaton.LogicBase
```

## Defining the DFA

```agda
data State {n : ℕ} : Set where
  q : (Fin n) → State

data Symbol {n : ℕ} : Set where
  σ : (Fin n) → Symbol

-- A word, a list of symbols
data Word {ns : ℕ} : ℕ → Set where
  [] : Word {ns} zero
  _∷_ : ∀ {n} (s : Symbol {ns}) (w : Word {ns} n) → Word {ns} (suc n)

-- A possibly infinite word, a list of symbols
data IWord {ns : ℕ} : Set where
  [] : IWord {ns}
  _∷_ : (Symbol {ns}) → IWord {ns} → IWord {ns}

TransitionFunction : {nq ns : ℕ} → Set
TransitionFunction {nq} {ns} = (State {nq} × Symbol {ns}) → State {nq}

record DFA
  {nq ns nf : ℕ}
  -- (Q : Vec (State {nq}) nq)
  -- (Σ : Vec (Symbol {ns}) ns)
  : Set where
  field
    δ : TransitionFunction {nq} {ns}
    q₀ : State {nq}
    F : Vec (State {nq}) nf
```

## Helpers

```agda
-- Check if two finite numbers are equal
fin-eq : {n : ℕ}
  → (Fin n)
  → (Fin n)
  → Bool
fin-eq zero zero = true
fin-eq zero (suc y) = false
fin-eq (suc x) zero = false
fin-eq (suc x) (suc y) = fin-eq x y

-- Check if two states are equal
state-eq : {n : ℕ}
  → State {n}
  → State {n}
  → Bool
state-eq (q x) (q y) = fin-eq x y

-- Check if a state is in a vec of states
elem-state : {nq n : ℕ}
  → (State {nq})
  → Vec (State {nq}) n
  → Bool
elem-state x [] = false
elem-state x (y ∷ ys) = if (state-eq x y) then true else elem-state x ys

postulate
  all-symbols-impl : {ns : ℕ} → (n : ℕ) → (n ≤ (suc ns)) → Vec (Symbol {suc ns}) n
-- all-symbols-impl {ns} zero n≤ns = []
-- all-symbols-impl {ns} (suc n) n1≤ns = σ (fromℕ< {n} n1≤ns) ∷ all-symbols-impl {ns} n (s≤s n1≤ns)

postulate
  all-symbols : {ns : ℕ} → Vec (Symbol {ns}) ns
-- all-symbols {zero} = []
-- all-symbols {suc ns} = all-symbols-impl {ns} (suc ns)

all-true : {n : ℕ} → Vec Bool n → Bool
all-true [] = true
all-true (x ∷ xs) = x ∧ all-true xs

∀symbols-check : {ns : ℕ}
  → ((Symbol {ns}) → Bool)
  → Bool
∀symbols-check {ns} p = all-true (map p (all-symbols {ns}))

∀symbols : {ns : ℕ}
  → ((Symbol {ns}) → Bool)
  → Bool
∀symbols {ns} p = ∀symbols-check {ns} p

-- Follow a single symbol through a DFA, returning a new DFA which starts on
-- the state reached by following the symbol
dfa-transition-one : {nq ns nf : ℕ}
  → (Symbol {ns})
  → DFA {nq} {ns} {nf}
  → DFA {nq} {ns} {nf}
dfa-transition-one sym dfa = record dfa { q₀ = (DFA.δ dfa) ((DFA.q₀ dfa), sym) }

-- Check if a DFA is in an accept state.
-- This checks if q₀ is in the set of accept states.
dfa-in-accept-state : {nq ns nf : ℕ}
  → DFA {nq} {ns} {nf}
  → Bool
dfa-in-accept-state dfa = elem-state (DFA.q₀ dfa) (DFA.F dfa)

cyclic-edge : {nq ns : ℕ}
  → State {nq}
  → Symbol {ns}
  → TransitionFunction {nq} {ns}
  → Bool
cyclic-edge state sym δ = state-eq (δ (state , sym)) state

dead-state : {nq ns : ℕ}
  → State {nq}
  → TransitionFunction {nq} {ns}
  → Bool
dead-state state δ = ∀symbols (λ sym → cyclic-edge state sym δ)
```

## Check if a DFA accepts a word

```agda
-- Follow a word through a DFA, returning a
-- new DFA which starts on the state reached
-- by following the symbols.
dfa-follow : {nq ns nf n : ℕ}
  → Word {ns} n
  → DFA {nq} {ns} {nf}
  → DFA {nq} {ns} {nf}
dfa-follow [] dfa = dfa
dfa-follow (sym ∷ ss) dfa = dfa-follow ss (dfa-transition-one sym dfa)

-- Check if a DFA accepts a word.
dfa-accepts : {nq ns nf n : ℕ}
  → Word {ns} n
  → DFA {nq} {ns} {nf}
  → Bool
dfa-accepts ls dfa = dfa-in-accept-state (dfa-follow ls dfa)

-- Follow a possibly infinite word through a DFA,
-- returning a new DFA which starts on
-- the state reached by following the symbols.
dfa-follow-infinite : {nq ns nf : ℕ}
  → IWord {ns}
  → DFA {nq} {ns} {nf}
  → DFA {nq} {ns} {nf}
dfa-follow-infinite [] dfa = dfa
dfa-follow-infinite (sym ∷ ss) dfa = dfa-follow-infinite ss (dfa-transition-one sym dfa)

-- Check if a DFA accepts a possibly infinite word.
dfa-accepts-infinite : {nq ns nf n : ℕ}
  → IWord {ns}
  → DFA {nq} {ns} {nf}
  → Bool
dfa-accepts-infinite ls dfa = dfa-in-accept-state (dfa-follow-infinite ls dfa)
```
 