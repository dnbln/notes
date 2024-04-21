---
title: Base logic
date: 2024-04-20
published: 2024-04-20
updated: 2024-04-20
tags:
  - agdomaton
growth-stage: seedling
---

# Imports

```agda
module Agdomaton.LogicBase where

open import Relation.Binary.PropositionalEquality using (_≡_; refl)
open import Data.Nat using (ℕ; zero; suc)
open import Data.Empty using (⊥; ⊥-elim)
open import Data.Sum using (_⊎_; inj₁; inj₂; [_,_])
open import Data.Product using (_×_; _,_; proj₁; proj₂)
open import Relation.Nullary using (¬_)
open import Axiom.Extensionality.Propositional using (Extensionality)
open import Data.List.Relation.Binary.Subset.Propositional.Properties
open import Relation.Unary using (Pred; _⊆_)
```

# Definitions

```agda
_⇔_ : Set → Set → Set
A ⇔ B = (A → B) × (B → A)
```

## Negation

```agda
postulate
    ¬¬-elim : {A : Set} → ¬ (¬ A) → A

¬¬¬-elim : {A : Set} → ¬ (¬ (¬ A)) → ¬ A
¬¬¬-elim ¬¬¬A = λ a → ¬¬¬A (λ ¬A → ¬A a)
```

# De Morgan laws

## De Morgan for disjunction

```agda
de-morgan-or-forward : ∀ {A B : Set} → (¬ (A ⊎ B)) → ((¬ A) × (¬ B))
de-morgan-or-forward ¬A⊎B = (λ a → ¬A⊎B (inj₁ a)) , (λ b → ¬A⊎B (inj₂ b))

de-morgan-or-backward : ∀ {A B : Set} → ((¬ A) × (¬ B)) → (¬ (A ⊎ B))
de-morgan-or-backward ¬A×¬B = [(proj₁ ¬A×¬B), (proj₂ ¬A×¬B)]

de-morgan-or : {A B : Set} → (¬ (A ⊎ B)) ⇔ ((¬ A) × (¬ B))
de-morgan-or = de-morgan-or-forward , de-morgan-or-backward
```

## De Morgan for conjunction

```agda
postulate
    de-morgan-and-forward : ∀ {A B : Set} → (¬ (A × B)) → ((¬ A) ⊎ (¬ B))

de-morgan-and-backward : ∀ {A B : Set} → ((¬ A) ⊎ (¬ B)) → (¬ (A × B))
de-morgan-and-backward ¬A⊎¬B A×B = [ (λ ¬A -> ¬A (proj₁ A×B)) , (λ ¬B → ¬B (proj₂ A×B) ) ] ¬A⊎¬B

de-morgan-and : {A B : Set} → (¬ (A × B)) ⇔ ((¬ A) ⊎ (¬ B))
de-morgan-and = de-morgan-and-forward , de-morgan-and-backward
```
