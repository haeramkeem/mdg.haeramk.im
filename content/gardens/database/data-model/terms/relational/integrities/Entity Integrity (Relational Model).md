---
tags:
  - mdg
  - database
  - data-model
  - relational-model
date: 2026-07-17
aliases:
  - Entity Integrity
---
> [!info] 작물 단계: #seed 

## 란?

- *Entity Integrity* 는 [[Private Key, PK (Relational Model)|PK]] 에 대한 제약조건 (integrity) 이다.
	- 여기서 [[Record (Relational Model)|entity]] 는 [[Record (Relational Model)|record]] 를 가리킨다.
- 다음을 만족해야 한다.
	- PK 는 [[Super Key (Relational Model)|uniqueness]] 를 만족해야 한다. 즉, record를 고유하게 식별해야 한다.
	- PK 는 `NULL` 이 될 수 없다.