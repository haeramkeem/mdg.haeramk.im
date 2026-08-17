---
tags:
  - mdg
  - database
  - sql
  - functions
date: 2026-08-05
aliases:
  - TO_DATE()
---
## 사용법

- Oracle 에서는 `TO_DATE()` 이다.
	- 여기서 `'날짜 형식'` 은 `'YYYY-MM-DD'` 이런식으로 적으면 `'2026-08-05'` 가 매칭된다.

```sql
TO_DATE('날짜', '날짜 형식')
```

- 그리고 MySQL 에서는 `STR_TO_DATE()` 이다.
	- 여기서 `'날짜 형식'` 은 `'%Y%m%d'` 이런식으로 적으면 `'20260805'` 가 매칭된다.

```sql
STR_TO_DATE('날짜', '날짜 형식')
```