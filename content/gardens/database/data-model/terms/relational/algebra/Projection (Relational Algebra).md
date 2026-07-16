---
tags:
  - mdg
  - database
  - data-model
  - relational-model
date: 2026-07-16
aliases:
  - Projection
---
> [!info]- 참고한 것들
> - [[01. Relational Model and Algebra|CMU-15445, Intro. to Database Systems]]

## Projection

$$
\pi_{attr}(rel)
$$

- *Projection* 은 특정 [[Relation (Relational Model)|relation]] 에서 특정 [[Record (Relational Model)|attribute]] 에 해당하는 값들을 뽑아내는 것이다.
	- 즉, `SELECT col FROM rel` 와 같다.
- 