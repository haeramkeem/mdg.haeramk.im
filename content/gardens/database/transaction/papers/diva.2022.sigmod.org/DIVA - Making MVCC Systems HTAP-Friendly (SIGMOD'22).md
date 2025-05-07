---
tags:
  - database
  - db-concurrency
aliases:
  - DIVA
  - Diva
  - diva
date: 2024-10-06
title: "(논문) DIVA: Making MVCC Systems HTAP-Friendly (SIGMOD'22)"
---
> [!info] DIVA 링크
> - [논문](https://dl.acm.org/doi/10.1145/3514221.3526135)

## 개요

![[Pasted image 20241006202859.png]]

- SIGMOD (Proc. Mgmt. of Data) 2022 년도에 소개된 DIVA 논문을 읽고 정리해 보자.

## Abstract

- [[Multiversion Concurrency Control, MVCC (Database Transaction)|MVCC]] 는 [[On-Line Transactional Processing, OLTP (Modern Database)|OLTP]] 의 관점에서는 많은 발전이 있었지만, 이것을 [[Hybrid Transactional and Analytical Processing, HTAP (Modern Database)|HTAP]] 시스템에서 [[On-Line Analytical Processing, OLAP (Modern Database)|OLAP]] query 에 대응하기 위해 사용하는 것은 어려움이 있다고 한다. 왜냐면:
	1. 빠른 version searching 와 적은 IO 을 보장하는 것이 힘들고
	2. Storage 에 부담을 덜 주기 위한 즉각적인 version GC 도 힘들기 때문
- 이런 문제점들은 OLTP 를 위한 MVCC 에서는 보통 version index 와 version data 를 통합한 Unified data storage 를 사용하고 있기 때문이었다.
- 따라서 이 문제를 DIVA 에서는 이 둘을 분리시켜 해결하려고 한다.
	- 이에 따라 이름이 *Decoupling Index from Version dAta* (*DIVA*) 가 되는 것.
- 이때의 key idea 는 다음과 같다.
	1. Provisional version indexing
	2. Time-interval based GC
- 이렇게 해서 구현된 DIVA 를 PostgreSQL 과 MySQL 에 모두 적용시켜 보았고, 그 결과로 HTAP 시스템에서 space-time 간 tradeoff 를 해결했다고 한다.

## 목차

> [!fail] #draft Partial-ready 상태입니다.

- [[1. Introduction (DIVA, SIGMOD'22)|1. Introduction]]
- [[3. Design Overview of DIVA (DIVA, SIGMOD'22)|3. Design Overview of DIVA]]
- [[4. Provisional Version Indexing (DIVA, SIGMOD'22)|4. Provisional Version Indexing]]
- [[5. Version Garbage Collection (DIVA, SIGMOD'22)|5. Version Garbage Collection]]