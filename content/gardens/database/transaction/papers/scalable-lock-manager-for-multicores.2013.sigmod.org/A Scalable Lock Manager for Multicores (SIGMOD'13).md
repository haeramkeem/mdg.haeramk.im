---
tags:
  - database
  - db-concurrency
date: 2025-05-05
title: (논문) A Scalable Lock Manager for Multicores (SIGMOD'13)
---
> [!info] 논문 링크
> - [논문](https://dl.acm.org/doi/pdf/10.1145/2463676.2465271)

## 개요

![[Pasted image 20250505192203.png]]

- SIGMOD (Proc. Mgmt. of Data) 2013 년도에 소개된 A Scalable Lock Manager for Multicores 논문을 읽고 정리해 보자.

## Abstract

> [!tip] 간단 요약본
> - [[A Scalable Lock Manager for Multicores (SIGMOD'13, Short Review)]]

- CPU 의 트랜지스터 집적도의 발전이 더뎌짐에 따라, 많은 CPU 제조사들은 집적도를 올리는 대신 더 많은 코어를 배치하는 *Multi-core* 전략을 취하기 시작한다.
- 이에 따라 많은 DBMS 들도 이런 multi-core 을 활용하기 시작했는데, 본 논문의 저자들은 더 많은 코어를 활용하여 *Multi-Programming Level* (*MPL*) 을 올렸을 때 workload 가 그다지 무겁지 않은데도 성능이 하락함을 발견했다.
- 그리고 이 원인이 DBMS 의 *Lock manager* 에서 lock table 을 참조할 때마다 giant latch 를 잡는 것에 있음을 알아냈고, 따라서 lock manager 에서 latch 를 없애거나 최대한 줄이는 식으로 이 문제를 해결했다.
	- 여기에서의 가장 핵심은 lock 들을 bulk 로 pre-allocate 해놓아 txn 들은 그냥 giant latch 없이 atomic operation 으로 구현된 linked-list manipulation operation 만 하면 되었고,
	- 생성된 lock 을 GC 하는 것도 bulk 로, 나중에 (defer) 수행하여 list 가 끊어지는 상황을 원천 봉쇄했다.

## 목차

> [!fail] #draft Partial-ready 상태입니다.