---
tags:
  - mdg
  - database
  - sql
date: 2026-05-31
aliases:
  - ORDER BY
---
## 사용법

- 아래처럼하면 `column1` 을 오름차순으로 정렬하는데

```sql
ORDER BY column1
```

- 이렇게 하지 말고 명시적으로 정렬방향을 넣어주는게 더 좋다. 오름차순 정렬은 `ASC` 이다.

```sql
ORDER BY column1 ASC
```

- 그리고 내림차순 정렬은 `DESC` 이다.

```sql
ORDER BY column1 DESC
```

- 마지막으로 여러 column + 방향을 명시하면 앞에나온 순서대로 우선순위가 부여되어 정렬된다.
	- 가령 아래의 경우에는 `column1` 을 내림차순 정렬하고, 동률인 애들은 `column2` 로 오름차순으로 정렬한다.

```sql
ORDER BY column1 DESC, column2 ASC
```