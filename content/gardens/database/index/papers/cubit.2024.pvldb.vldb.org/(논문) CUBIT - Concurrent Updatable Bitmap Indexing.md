---
tags:
  - database
  - db-index
date: 2025-11-15
aliases:
  - CUBIT
title: "(논문) CUBIT: Concurrent Updatable Bitmap Indexing"
---
> [!info] CUBIT 링크
> - [논문](https://dl.acm.org/doi/10.14778/3705829.3705854)

## 개요

![[Pasted image 20251115182035.png]]

- VLDB (Very Large Database) 2024 년도에 소개된 CUBIT 논문을 읽고 정리해 보자.

## Abstract

- [[Bitmap Index (Database Index)|Bitmap Index]] 는 적은 clustered 되어 있기 때문에 (즉, logical order 와 physical order 가 같기 때문에) [[Index (Database)|Secondary index]] 를 [[B+ Tree (Database Index)|B+ Tree]] 로 구성하였을 때보다 더 빠르고 메모리 사용량도 적게 먹는다.
	- B+ Tree 로 secondary index 를 하게 되면 보통은 unclustered 이기 때문.
- 하지만 지금까지의 bitmap index 는 update 가 약점이었는데, 이 점은 최근 주목받는 [[Hybrid Transactional and Analytical Processing, HTAP (Modern Database)|HTAP]] 추세에는 별로 좋지 않다.
- 이 논문에서는 이 bitmap index 를 concurrent 하고 updatable 할 수 있게 만드는 방법을 제시한다.
	- 그래서 논문 이름도 Concurrent Updatable BITmap (CUBIT) 이다.
- 핵심적인 설계는 다음의 세 가지 이다:
	- 우선, bitmap index 의 update 를 처리하는 Horizontal Update Delta (HUD) 방법을 제시하고
	- [[Multiversion Concurrency Control, MVCC (Database Transaction)|MVCC]] 로 snapshot 을 이용해 read-write blocking 을 해결하며
	- MVCC 를 사용했을 때 항상 등장하는 version consolidation 도 latch-free 하게 처리하는 방법에 대해 소개한다.
- 이렇게 함으로써 index operation 에 대해서는 SOTA 에 비해 최대 16배의 throughput 과 220배의 latency 향상, [[TPC-H (Database Benchmark)|TPC-H]] 에 대해서는 최대 2.7배 성능 향상, 그리고 [[CH-benCHmark (Database Benchmark)|CH-benCHmark]] 에 대해서는 최대 11배 성능 향상이 있었다고 한다.

## 목차

> [!fail] #draft 나중에 정리할 예정입니다.

- [[1. Introduction (CUBIT, VLDB 24)|1. Introduction]]
- [[4. CUBIT Design (CUBIT, VLDB 24)|4. CUBIT Design]]