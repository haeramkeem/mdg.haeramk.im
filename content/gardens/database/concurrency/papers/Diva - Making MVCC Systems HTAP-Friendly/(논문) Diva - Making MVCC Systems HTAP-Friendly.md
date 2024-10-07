---
tags:
  - database
  - db-concurrency
aliases:
  - DIVA
  - Diva
  - diva
date: 2024-10-06
---
> [!info] Diva 링크
> - [논문](https://dl.acm.org/doi/10.1145/3514221.3526135)

## 개요

![[Pasted image 20241006202859.png]]

- SIGMOD (Proc. Mgmt. of Data) 2022 년도에 소개된 Diva 논문을 읽고 정리해 보자.

## Abstract

- [[Multiversion Concurrency Control, MVCC (Database)|MVCC]] 는 [[On-Line Transactional Processing, OLTP (Database)|OLTP]] 의 관점에서는 많은 발전이 있었지만, [[Hybrid Transactional and Analytical Processing, HTAP (Database)|HTAP]] 에서는 어려움이 있다고 한다. 왜냐면:
	1. [[On-Line Analytical Processing, OLAP (Database)|OLAP]] query 에 대응하기 위한 빠른 version searching 와 적은 IO 을 보장해는 것이 힘들고
	2. Storage 에 부담을 덜 주기 위한 즉각적인 version GC 도 힘들기 때문
- OLTP 를 위한 MVCC 에서는 보통 통합된 version data storage 를 사용하고 있고, 따라서 위의 두 문제가 결합되어 있었지만
- 이 문제를 Diva 에서는 index 와 version storage 를 분리시켜 이것을 해결하려고 한다.
- 이때의 key idea 는 다음과 같다.
	1. Provisional version indexing
	2. Time-interval based GC
- 이렇게 해서 구현된 Diva 를 PostgreSQL 과 MySQL 에 모두 적용시켜 보았고, 그 결과로 HTAP 시스템에서 space-time 간 tradeoff 를 해결했다고 한다.

## 목차

> [!fail] #draft Partial-ready 상태입니다.