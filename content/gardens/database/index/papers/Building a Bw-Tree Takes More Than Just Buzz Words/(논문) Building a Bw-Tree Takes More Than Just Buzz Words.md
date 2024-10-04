---
tags:
  - database
  - db-index
date: 2024-10-04
---
> [!info] OpenBwTree 링크
> - [논문](https://dl.acm.org/doi/10.1145/3183713.3196895)

## 개요

![[Pasted image 20241004200557.png]]

- SIGMOD (Proc. Mgmt. of Data) 2018 년도에 소개된 OpenBwTree 논문을 읽고 정리해 보자.

## Abstract

- 일단 이놈은 lock-free [[Index (Database)|Index]] 로, MS SQL Server 의 Hekaton 엔진에 처음으로 탑재되었다고 한다.
	- 그리고 그 내용은 2013년에 [이 논문](https://ieeexplore.ieee.org/document/6544834) 에서 소개된다.

## 목차

> [!fail] #draft Partial-ready 상태입니다.

- [[2. Bw-Tree Essentials (OpenBwTree, SIGMOD 18)|2. Bw-Tree Essentials]]
- [[4. Component Optimization (OpenBwTree, SIGMOD 18)|4. Component Optimization]]