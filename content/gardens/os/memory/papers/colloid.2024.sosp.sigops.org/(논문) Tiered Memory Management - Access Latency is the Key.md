---
tags:
  - os
  - paper-review
  - os-memory
date: 2025-01-14
title: "(논문) Tiered Memory Management: Access Latency is the Key!"
aliases:
  - Colloid
---
> [!info] Colloid 링크
> - [논문](https://dl.acm.org/doi/10.1145/3694715.3695968)
> - [코드](https://github.com/host-architecture/colloid)

## 개요

![[Pasted image 20250114084901.png]]

- SOSP (Symposium on Operating Systems Principles) 2024 년도에 소개된 *Colloid* 논문을 읽고 정리해 보자.

## Abstract

- Tiered memory architecture 에서, 지금까지 제안된 방식은 모두 공통의 가정을 한다: 빠른 메모리 (*default tier*) 에 자주 사용되는 데이터 (*hot page*) 들을 올리고, 그렇지 않은 데이터 (*cold page*) 는 느린 메모리 (*alternate tier*) 에 올리면 성능이 향상될 것이다.
- 하지만 본 논문에서는 그렇지 않다는 것을 보여준다. 메모리 참조가 많아짐에 따라 default tier 의 latency 는 HW 스펙에 명시된 latency 보다 훨씬 커질 수 있고, 이에 따라 alternate tier 에 비해 2.5 배 더 latency 가 커질 수도 있다는 것이다.
- 따라서 본 논문에서 제시하는 *Colloid* 는 HW 스펙에 기반한 latency 가 아닌, 실 사용중의 latency 에 기반한 memory allocation 기법을 제시한다.
- 결과적으로 *Colloid* 는 전체적인 latency 를 줄여 application level 의 성능이 향상되는 것을 보인다.
- 이를 위해 *Colloid* 에서는 (1) 어떻게 이 실 사용중의 latency 를 측정해 낼 것인가? (2) 이 latency 를 기반으로 어떻게 memory allocation 을 할 것인가? 의 두 질문에 대한 해결책을 내놓는다.
- 본 논문에서는 또한 이 *Colloid* 를 SOTA memory allocation architecture 인 [HeMem](https://dl.acm.org/doi/10.1145/3477132.3483550) 와 [TPP](https://dl.acm.org/doi/10.1145/3582016.3582063), [MEMTIS](https://dl.acm.org/doi/10.1145/3600006.3613167) 와 결합하고, 이에 대한 evaluation 을 하여 공개하여 *Colloid* 가 near-optimal 한 성능이 나옴을 보여준다.

## 목차

- [[1. Introduction (Colloid, SOSP 24)|1. Introduction]]
- [[2. Motivation (Colloid, SOSP 24)|2. Motivation]]
- [[3. Colloid (Colloid, SOSP 24)|3. Colloid]]
- [[4. Colloid with Existing Memory Tiering Systems (Colloid, SOSP 24)|4. Colloid with Existing Memory Tiering Systems]]