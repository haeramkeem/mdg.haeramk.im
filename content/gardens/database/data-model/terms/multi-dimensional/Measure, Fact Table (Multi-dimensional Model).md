---
tags:
  - database
  - data-model
  - multidimensional-model
date: 2024-08-22
aliases:
  - Fact table
---
> [!info]- 참고한 것들
> - [긱](https://www.geeksforgeeks.org/multidimensional-data-model/)

## Measure, Fact Table

- *Measure* 은 [[Multi-Dimensional Data Model (Database)|Multi-dimensional data model]] 에서 실제 "숫자 값" 을 의미한다.
	- 가령 "$35" 와 같은 실제 "값" 들을 의미하는 것.
- 그리고 얘들이 담기는 테이블을 *Fact Table* 라고 부른다.

### 특징

- 분석하기 위해 축적되는 데이터를 담는 테이블인 만큼, *Fact Table* 에서는 `UPDATE` 나 `DELETE` 보다는 `INSERT` 의 비중이 더 크다.
	- 가령 고객의 주문 정보 데이터를 생각해 보면 주문 정보가 계속 쌓이는 것이 일반적일 것이다.
		- 물론 고객이 주문을 취소한다면, 주문 처리 상태를 "취소" 로 바꾸는 `UPDATE` 가 일어날 수는 있다.
		- 그래도 이건 `INSERT` 에 비하면 현저히 적을 것이고, `DELETE` 는 거의 없다고 봐도 될 것이다.
	- 이건 [[On-Line Analytical Processing, OLAP (Modern Database)|OLAP]] 와 [[On-Line Transactional Processing, OLTP (Modern Database)|OLTP]] 의 차이와도 결부지어서 생각해 볼 수 있다; OLTP 에서는 `INSERT` 말고도 `UPDATE` 나 `DELETE` 가 충분히 많이 발생할 수 있다.
		- 가령 롤 계정 정보를 생각해 보자.
			- 회원가입을 한다면 `INSERT` 가 일어날테고,
			- 탈퇴를 한다면 `DELETE` 가 일어날테며,
			- 뭐 RP 가 늘어나면 `UPDATE` 가 일어날 것이야.
	- 즉, OLAP 에서는 시계열 데이터를 축적하는 느낌이 강하고, OLTP 에서는 현재 "상태", 즉 "스냅샷" 의 느낌이 강하다는 점에서 이것을 이해하면 된다.