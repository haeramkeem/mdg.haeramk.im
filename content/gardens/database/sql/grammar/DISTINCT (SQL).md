---
tags:
  - mdg
  - database
  - sql
  - grammar
date: 2026-08-05
aliases:
  - DISTINCT
---
> [!info] 작물 단계: #seed 

## 사용법

- 이렇게 하면 결과에서 중복이 제거되어 나온다.

```sql
SELECT DISTINCT ...
```

- 그리고 중복을 제거하여 개수를 세고싶으면 이렇게 하면 된다.

```sql
SELECT COUNT(DISTINCT col) ...
```