---
tags:
  - database
  - db-recovery
date: 2025-05-05
title: (논문) Scalable Database Logging for Multicores (VLDB'18)
aliases:
  - Eleda
---
> [!info] Eleda 링크
> - [논문](https://www.vldb.org/pvldb/vol11/p135-jung.pdf)

## 개요

![[Pasted image 20250505220341.png]]

- VLDB (Very Large Database) 2018 년도에 소개된 Eleda 논문을 읽고 정리해 보자.

## Abstract

> [!tip] 간단 요약본
> - [[4. Eleda Design (Eleda, VLDB'18)]]

- DBMS 는 log buffer 에 log 를 적고, [[Write Ahead Log, WAL (Database Recovery)|WAL]] principle 에 따라 flush 하여 logging-recovery 의 방식으로 효율적인 [[Transaction, ACID (Database)|ACID]] 를 제공한다.
- 하지만 중앙화된 logging system 은 multicore 시대가 옴에 따라 scalability issue 가 생겨났고, synchronous I/O 에 의한 delay 도 overhead 가 커지고 있다.
- 그래서 이 논문에서는 scalability 가 높은 자료구조인 *GRACEHOPPER* 와, latency hinding 을 통해 synchronous I/O 상황에서도 빠르고 확장성이 높은 logging architecture 인 *ELEDA* 를 제시한다.
- 또한 이것을 Wiretiger 와 Shore-MT 에 구현해 기존의 시스템보다 최대 71 배 더 높은 성능 향상을 보여준다고 한다.

## 목차

> [!fail] #draft Partial-ready 상태입니다.

- [[4. Eleda Design (Eleda, VLDB'18)|4. Eleda Design]]