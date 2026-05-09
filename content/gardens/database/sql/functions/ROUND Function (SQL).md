---
tags:
  - mdg
  - database
  - sql
  - functions
date: 2026-05-08
aliases:
  - ROUND()
---
## 사용법

- 반올림하는 함수.
- 아래처럼하면 그냥 소숫점 첫번째자리에서 반올림하고

```sql
ROUND(column)
```

- 숫자 인자를 추가로 넣으면 해당 소숫점까지 표시한다.

```sql
ROUND(column, digits)
```