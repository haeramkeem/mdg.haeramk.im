---
tags:
  - mdg
  - database
  - sql
  - functions
date: 2026-05-09
aliases:
  - COALESCE()
---
## 사용법

- `NULL` 이 아닌 첫번째 값을 반환하는 함수

```sql
COALESCE(col1, col2, col3, ...)
```

- 위 SQL 에서 만약 `col1` 가 `NULL` 이고 `col2` 가 `NULL` 이 아니라면 결과는 `col2` 가 반환된다.

## 활용: NULL 대체

- `COALESCE` 가 `NULL` 이 아닌 첫번째 값을 반환하기 때문에, 이놈을 이용해서 column 값이 `NULL` 일 경우 다른 값으로 대체하는 용도로 사용할 수 있다.
	- 물론 이 용도로의 함수는 따로 있다. 근데 DBMS마다 함수가 달라서 그냥 이거 쓰자.

```sql
COALESCE(column, alt)
```