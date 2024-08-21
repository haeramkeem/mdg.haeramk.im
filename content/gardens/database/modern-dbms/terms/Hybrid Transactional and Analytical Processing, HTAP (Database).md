---
tags:
  - Database
date: 2024-08-21
---
> [!info]- 참고한 것들
> - [위키](https://en.wikipedia.org/wiki/Hybrid_transactional/analytical_processing)

## OLTP + OLAP

- 이름 그대로 [[On-Line Transactional Processing, OLTP (Database)|OLTP]] 와 [[On-Line Analytical Processing, OLAP (Database)|OLAP]] 를 하이브리드로 하나의 [[Database Management System, DBMS (Database)|DBMS]] 에서 제공하는 것을 일컫는다.
- 하나의 DBMS 에서 두가지 기능을 제공하는 것은 나름의 장점이 있다.
	- 우선 [[Extract-Transform-Load, ETL (Database)|ETL]] 이 빨라지고, 저장공간도 덜 필요로 한다.
		- 이건 기존에는 ETL 에 의해 OLTP 의 row data 를 OLAP 에 column data 로 옮겼다면
		- HTAP 에서는 이런 데이터 "복사" 가 필요 없기 때문.
- 하지만 이것은 기술적으로는 어려운 점이 많다.
	- 생각해 보면 OLTP 는 (1) 적은 수의 (2) row data 를 다루는 반면
	- OLAP 는 (1) 많은 수의 (2) column data 를 다루기 때문.