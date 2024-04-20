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
open import Data.Fin.Base
open import Data.Vec
open import Agda.Builtin.List
open import Data.Bool.Base
open import Agda.Primitive
open import Agda.Builtin.IO using (IO)
open import Agda.Builtin.Unit using (⊤)
open import Agda.Builtin.String using (String)

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

dfa-accepts : {nq ns nf : ℕ} → (List (Symbol {ns})) → DFA {nq} {ns} {nf} → Bool
dfa-accepts [] dfa = elem-state (DFA.q₀ dfa) (DFA.F dfa)

dfa-accepts (s ∷ ss) dfa = dfa-accepts ss (record dfa { q₀ = (DFA.δ dfa) ((DFA.q₀ dfa), s) })

test-dfa : Bool
test-dfa = dfa-accepts ((σ zero) ∷ (σ zero) ∷ []) 2-length-counter

postulate putStrLn : String → IO ⊤
{-# FOREIGN GHC import qualified Data.Text as T #-}
{-# COMPILE GHC putStrLn = putStrLn . T.unpack #-}

show : Bool → String
show true = "true"
show false = "false"

main : IO ⊤
main = putStrLn (show test-dfa)
```
