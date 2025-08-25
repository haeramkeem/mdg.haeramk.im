---
tags:
  - database
  - db-operation
date: 2025-08-25
aliases:
  - JOIN
  - join
  - Join
---
> [!info]- 참고한 것들
> - [스댕](https://stackoverflow.com/q/13997365)

> [!warning] #draft 토막글입니다.

## 종류

![[Pasted image 20250825092441.png]]

- *INNER JOIN* 혹은 그냥 *JOIN*: 가운데 교집합
- *LEFT, RIGHT JOIN*: 왼쪽 혹은 오른쪽의 Row 를 전부 출력하되 교집합 부분은 `INNER JOIN` 하고 동일하고 나머지는 값이 없으므로 전부 `NULL` 로 조회된다.
	- 따라서 반대쪽의 `PRIMARY_KEY` 를 `NULL` 과 비교하는 `WHERE` 절을 넣게 되면 Exclude 연산을 할 수 있게 된다 (그림에서 중앙의 양쪽 다이어그램).
- *FULL OUTER JOIN* 혹은 *OUTER JOIN*: 두 테이블의 Row 를 전부 출력하되 교집합 부분은 `INNER JOIN` 과 동일함
	- 따라서 `PRIMARY_KEY` 를 `NULL` 과 비교하는 `WHERE` 절을 통해 `INNER JOIN` 만 제외하고 출력할 수 있다 (오른쪽 하단 다이어그램).