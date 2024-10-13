---
tags:
  - database
  - db-index
date: 2024-10-04
aliases:
  - OpenBwTree
---
> [!info] OpenBwTree 링크
> - [논문](https://dl.acm.org/doi/10.1145/3183713.3196895)

## 개요

![[Pasted image 20241004200557.png]]

- SIGMOD (Proc. Mgmt. of Data) 2018 년도에 소개된 OpenBwTree 논문을 읽고 정리해 보자.

## Abstract

- 일단 이놈은 lock-free [[Index (Database)|Index]] 로, MS SQL Server 의 Hekaton 엔진에 처음으로 탑재되었다고 한다.
	- 그리고 그 내용은 2013년에 [이 논문](https://ieeexplore.ieee.org/document/6544834) 에서 소개된다.
- 이것은 다음의 두 key idea 로 달성된다: (1) *Delta chain* (2) *Indirection layer* with *atomic Compare-and-Swap*
- 하지만 위의 Hekaton 엔진 버전 논문에서는 (아무래도 영업비밀이다보니) 이 코드를 공개하지 않았는데, 조심히 다루어야 하는 Index 구현의 특성상 기존의 논문만으로는 Bw-Tree 를 잘못 구현하여 문제가 발생할 가능성이 충분했다고 한다.
- 따라서 이 논문에서는
	1. Bw-Tree 에서 누락된 구현 가이드를 추가하고
	2. Bw-Tree 을 더 개선시킬 수 있는 방법도 소개하며
		- 이것은 Bw-Tree 뿐 아니라 lock-free 를 구현하는 일종의 노하우? 로도 확장시킬 수 있다고 한다.
	3. 이렇게 만든 Bw-Tree 를 open source 로 공개하고 (다만 코드는 못찾음)
	4. 기존의 lock-free 및 locking index 과의 비교
		- 기존의 Bw-Tree 대비 1.1 ~ 2.5 배 더 좋다고 한다.
- 를 하는 contribution 을 했다고 한다.

## 목차

> [!fail] #draft Partial-ready 상태입니다.

- [[2. Bw-Tree Essentials (OpenBwTree, SIGMOD 18)|2. Bw-Tree Essentials]]
- [[4. Component Optimization (OpenBwTree, SIGMOD 18)|4. Component Optimization]]