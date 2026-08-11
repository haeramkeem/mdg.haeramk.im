---
tags:
  - mdg
  - database
  - sql
  - grammar
date: 2026-08-05
aliases:
  - LIMIT
---
> [!info] 작물 단계: #seed 

## 사용법

> [!warning] 표준은 아님
> - MySQL 및 PG (+ PG 의 query parser 를 사용하는 DuckDB 등) 에서만 사용 가능하다.

- 결과를 몇개까지 반환할지 정하는 놈이다.

```sql
LIMIT {개수}
```