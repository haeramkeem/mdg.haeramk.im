---
tags:
  - database
  - db-recovery
date: 2025-05-05
title: "(논문) Border-Collie: A Wait-free, Read-optimal Algorithm for Database Logging on Multicore Hardware (SIGMOD'19)"
aliases:
  - Border-Collie
---
> [!info] Border-Collie 링크
> - [논문](https://dl.acm.org/doi/pdf/10.1145/3299869.3300071)

## 개요

![[Pasted image 20250505234830.png]]

- SIGMOD (Proc. Mgmt. of Data) 2019 년도에 소개된 Border-Collie 논문을 읽고 정리해 보자.

## Abstract

> [!tip] 간단 요약본
> - [[Border-Collie - A Wait-free, Read-optimal Algorithm for Database Logging on Multicore Hardware (SIGMOD'19, Short Review)]]

- DBMS 는 상태를 변경하는 모든 동작들에 대한 log 를 남기고, 이것으로 Atomicity 와 Durability 를 보장한다.
- 하지만 multicore 의 시대가 오면서 기존의 방식이 확장성의 문제가 있었고, 따라서 본 논문에서는 logging 의 요구사항을 재해석하여 이 *Border-Collie* 라는 logging architecture 를 제시한다.
- 여기서 제시하는 요구사항은 logging 을 위해서는 log 들이 (1) 순서대로 (2) overlap 이나 (3) hole 없이 저장되어 있는 upper bound 를 구해서 그만큼을 flush 해야 한다는 것이다.
- 그래서 이 *Border-Collie* 에서는 특정 worker 가 idle 해지더라도 정확하게 이 upper bound 를 찾고 읽어야 하는 log 의 양까지 줄인 logging architecture 를 제시한다.
- 실험 결과 2배정도 logging overhead 가 줄고, 거의 유사한 throughput 에 commit latency 가 현저히 작아졌다고 한다.

## 목차

> [!fail] #draft Partial-ready 상태입니다.
