---
tags:
  - mdg
  - database
  - data-model
  - relational-model
date: 2026-08-12
aliases:
  - Select
---
> [!info]- 참고한 것들
> - [[01. Relational Model and Algebra|CMU-15445, Intro. to Database Systems]]

## Select

$$
\sigma_{predicate}(R)
$$

- 기본 형태는 위와 같다.
	- 여기서 $predicate$ 라는 것은 "조건문 (condition)" 혹은 "필터 (filter)" 로 생각하면 된다.
		- 이 $predicate$ 은 일반 조건문처럼 AND (Conjunction, `&&`, $\wedge$) 나 OR (Disjunction, `||`, $\vee$) 를 사용하여 더욱 복잡한 조건을 달 수도 있다.
	- 즉, relation $R$ 에서 저 $predicate$ 를 만족하는 tuple 들을 "골라 (select)" 내라는 연산자인 것.
- 이것을 SQL 로 표현해 보면 아래와 동일하다:

```sql
SELECT * FROM R
WHERE {{ predicate }};
```