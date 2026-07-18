---
tags:
  - mdg
  - database
  - data-model
  - relational-model
  - normalization
date: 2025-09-15
aliases:
  - Normalization
  - 정규화
---
> [!info] 작물 단계: #seed 

## Normalization, 정규화

- 일단 정규화의 가장 큰 목표는 중복된 데이터를 최소화하는 것이다.
- 이렇게 함으로써 무결성 (Integrity) 도 줄일 수 있고, DB 의 용량도 줄일 수 있으며 연산의 양도 줄일 수 있게 된다.
- 하지만 너무 많이 쪼개면 JOIN 의 비용이 늘어나기 때문에 성능과 중복 간에 적당히 타협을 해서 정규화하는 것이 중요하다.
- 종류는 다음의 4가지가 있다:
	- [[First Normal Form, 1NF (Normalization)|1NF]]
	- [[Second Normal Form, 2NF (Normalization)|2NF]]
	- [[Third Normal Form, 3NF (Normalization)|3NF]]
	- [[Boyce-Codd Normal Form, BCNF (Normalization)|BCNF]]