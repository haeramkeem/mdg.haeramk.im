---
tags:
  - mdg
  - database
  - data-model
  - relational-model
date: 2026-07-17
aliases:
  - Candidate Key
  - 후보키
---
> [!info] 작물 단계: #seed 

## 란?

- 한 [[Super Key (Relational Model)|Super Key]] 에서 [[Record (Relational Model)|attribute]] 집합 중 어떤 한 attribute 를 빼기만 해도 [[Record (Relational Model)|record]] 를 고유하게 식별하지 못한다고 해보자. 이때 이걸 *Candidate Key* 라고 한다.
	- '어떤 한 attribute 를 빼기만 해도 record 를 고유하게 식별하지 못한다' 는 *minimal* 라고 하고, 그래서 'minimal superkey' 가 *Candidate Key* 가 된다.