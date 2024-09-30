---
published: 2024-09-29
updated: 2024-09-29
date: 2024-09-29
tags:
  - narxia
growth-stage: seedling
title: The problem statement
---
## The idea

The idea behind this problem is, how could we optimally partition code on a HPC distributed system, in a fully automated manner, by the compiler, with complete knowledge of how the entire system interacts.

## Definitions

We have to start off with a couple definitions first:

### The basics

- We define $F$ as the **set of all the functions in the system**.
- We define $N$ as the **set of all the nodes** we want to partition the functionality to.
- We define a **calling pair** as an ordered pair of functions $(f_1, f_2) \in F \times F$, where function $f_1$ directly calls $f_2$.
- We define $\textbf{CP}$ as the set of all calling pairs.
- We define a **partitioning** as a function $p : F \to N$.
- We define a **node boundary** as $(f_1, f_2) \in CP$, where $p(f_1) \ne p(f_2)$, given that $p$ is the chosen partitioning.
- We define $B(p)$ as the **set of all the node boundaries**, given the partitioning $p$.
- We define $Cnt(f_1, f_2)$ as the **average number of times** function $f_1$ has to call $f_2$.
- We define $Ct (f_1, f_2, p)$ as the ***cost*** of calling $f_2$ from $f_1$, given partitioning $p$. We can further expand on this, as follows:

$$
Ct(f_1, f_2, p) = \begin{cases}
	\begin{align*}
	Cnt(f_1, f_2) \cdot ( & M_c + Trp(l_c, p(f_1), p(f_2)) + U_c + \\ & M_r + Trp(l_r, p(f_2), p(f_1)) + U_r), \text{ if } (f_1, f_2) \in B(p)
	\end{align*} \\
	0, \text{otherwise}
\end{cases}
$$

Here, $M_c$, $U_c$, $M_r$ and $U_r$ are the marshalling and un-marshalling costs associated with the RPC, for the call and response respectively. $Trp(l, n_1, n_2)$ is the transport cost of a marshalled message of length $l$ between nodes $n_1$ and $n_2$, which has to be added twice: once for the call and once for the response.
- We define $C(f)$ as the total number of times that function $f$ is called, during a normal, as-close-to-the-real-use scenario as possible, in a given time frame. We assume that it is possible to run instrumented binaries in a staging state, routing a statistically representative fraction of the real traffic to those instrumented binaries, and then estimating the total number of times those functions would be called from that.

### Introducing distributed computing

As of right now, if we were to optimise for the cost function defined above, we would find quite a simple answer: $B(p) = \emptyset$. This works out well for small systems where the load is small, so a single node can handle all the functionality of the app, but we are going for distributed systems, so we will also introduce the following 5 additional concepts:

- We define a **load criterion** as some computing resource that would be required for running that function. This does not include the load incurred by function calls within that function, either to other functions or any form of recursion. Example of load criterions could include busy CPU time, memory usage, external storage usage (for example, persistent storage through disks). The list of criterions considered is predefined and static.
- We define $K$ as the **set of all load criterions**.
- We define $L_{1,k}(f, n)$ as the **average load** that node $n$ would incur if we were to put function $f$ on it, from a single function call, with regards to the load criterion $k$; we are going to assume that function $f$ might take up different loads if put on different nodes, for example, because of certain specialised hardware that would allow heavy computations to run faster on a node when they are present as opposed to another node where they aren't.
- We define $Cp_k(n)$ as the **capacity** of node $n$, that is, the total load, with regards to load criterion $k$, that it can handle before it gets "overwhelmed," and performance starts to suffer drastically.
- We define $L_k(f, n)$ as the **total load** incurred if we were to put function $f$ on node $n$, with regards to load criterion $k$. $L_{1,k}$ is for a single function call, whereas this would be for all calls to the function $f$, so we expect it to be about $C(f) \cdot L_{1,k}(f, n)$.

## The actual problem statement
Given all the definitions outlined above, we are finally able to give a formal definition of the problem:

Find a set of nodes $N$ and a partitioning of the functions in the system $p$ such that the following conditions all hold simultaneously:

### No unused nodes

Formally,

$$ \forall n \in N, \exists f \in F, p(f) = n $$

### No overload

We can roughly describe a no-overload condition as:

$$
\forall k \in K,
\forall n \in N,
\sum_{f \in F | p(f) = n} L_{k}(f, n) \leq Cp_k(n) 
$$

Or, the total load of a node always stays below, or is at most equal to the capacity of the node, with regards to _every_ load criterion.

For now, we assume that the following holds:
$$
L_k(f, n) \leq Cp_k(n), \forall f \in F, \forall n \in N, \forall k \in K
$$

There are functions that could overload a single node by themselves if we were to put them on only one, therefore this doesn't always hold, and so we will make some minor adjustments in the partitioning algorithm, as well as introducing load balancing, in a later chapter, but for now we will stick with this.

### Minimize function call cost

Formally, find partitioning $p$:

$$
\min_{p} \Bigg(\sum_{(f_1, f_2) \in CP} Ct (f_1, f_2, p)\Bigg)
$$



## Heuristics

It is computationally unfeasible to try to find the global minimum, so we are going to be using a few heuristics here and there:

### Heuristic 1:  Source-supplied function distribution rules
<a name="distribution_local" ></a>
#### `#[distribution_local]`
Certain functions can be manually annotated as `#[distribution_local]`. For example, very small and simple functions, basic utilities, and lots of functions that you would typically find in standard libraries of programming languages not intended for distributed computing. Consider for example Rust's `Option::map`. It makes no sense to try to put it on another node. What should happen instead in such cases is that it gets duplicated over all the nodes it is referenced in. This is what the `#[distribution_local]` attribute does. It tells the compiler that wherever this function is referenced, it should make a clone of it and put it on the same node as the function that is calling it.

#### `#[distribution_loadbalanced]`
Other functions, namely those that are too heavy for a single node to carry out, can be distributed across multiple nodes, which are then put behind a load balancer. Depending on how many calls the function gets, it could use either a global load balancer, or a load balancer node dedicated specifically for this function.

#### The `NPin` trait
Types implementing the `NPin` trait are types which are not allowed to cross a node boundary, and as such, all processing of values containing those types have to happen on a single node, from creation until destruction. The N in `NPin` stands for node.

Examples of types include that deal with external libraries, file handles or network sockets on the specific node. The compiler treats all functions that have an `NPin` type in their signature as if they were flagged with [`#[distribution_local]`](#distribution_local).

#### The `GPin` trait
Stands for Global Pin, and this trait has a stronger requirement than [The `NPin` trait](#the-npin-trait). Namely, it requires that the values of a certain type are all processed on a single node. That is different from the `NPin` trait, which allows multiple nodes to use the values of this type, so long as they do not cross . In `GPin`'s case, all functions that deal with values of this type have to be partitioned to a **single** node.