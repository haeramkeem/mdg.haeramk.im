---
tags:
  - database
date: 2024-08-21
aliases:
  - HTAP
---
> [!info]- 참고한 것들
> - [위키](https://en.wikipedia.org/wiki/Hybrid_transactional/analytical_processing)

## OLTP + OLAP

- 이름 그대로 [[On-Line Transactional Processing, OLTP (Modern Database)|OLTP]] 와 [[On-Line Analytical Processing, OLAP (Modern Database)|OLAP]] 를 하이브리드로 하나의 [[Database Management System, DBMS (Database)|DBMS]] 에서 제공하는 것을 일컫는다.

### 장점

- 하나의 DBMS 에서 두가지 기능을 제공하는 것은 나름의 장점이 있다.
- 우선 저장공간을 덜 필요로 한다.
	- 이건 기존에는 ETL 에 의해 OLTP 의 row data 를 OLAP 에 column data 로 옮겼다면
	- HTAP 에서는 이런 데이터 "복사" 가 필요 없기 때문.
- 또한 [[Extract-Transform-Load, ETL (Modern Database)|ETL]] 이 빨라진다.
	- 위와 유사한 이유로, OLTP 와 OLAP 를 별도로 운용하면서 생기는 (데이터 이동과 같은) 지연이 적어지기 떄문에 HTAP 을 사용하면 up-to-date analytics 가 가능해지는 것.

### 단점; 기술적인 어려움

- 하지만 이것은 기술적으로는 어려운 점이 많다.
- 우선 OLTP 와 OLAP 각각은 저장하고 이용하는 데이터의 성격이 다르다.
	- 생각해 보면 OLTP 는 (1) 적은 수의 (2) row data 를 다루는 반면
	- OLAP 는 (1) 많은 수의 (2) column data 를 다루기 때문에
	- 이 둘을 모두 제공하고자 하는 HTAP 입장에서는 이 두 종류의 query 에 모두 최적화된 설계를 해야 한다.
		- 설명을 덧붙이자면, 저 둘 간에는 trade-off 가 있다.
			- OLTP 에만 집중하자면 column data 가 아닌 row data 로 OLAP query 에 대응해야 하기 때문에 IO amplification 이 발생하고,
			- OLAP 에만 집중하자면 transaction 을 처리할 때 각 column 로 잘라야 하기 때문에 transaction 처리 성능이 구려진다.
- 또한 OLTP 와 OLAP 를 분리하면 performance isolation 이 쉽게 가능하지만, HTAP 에서는 힘들다.
	- 이것도 당연한 일이다; OLTP 와 OLAP 각각 독립된 데이터를 붙들고 있기 때문에 한 놈이 자신의 데이터를 가지고 사부작거려도 다른놈에게는 영향을 주지 않는다.
	- 하지만 HTAP 에서는? 만약 OLAP 가 column data 를 쭉 읽어다가 query processing 을 하는 도중에 OLTP 가 그 데이터를 휙 바꿔버리면 어떻게 해야 할까?
- Multi-node 로 HTAP 을 구성하면 각 node 가 일부 데이터를 붙들고있기 때문에 문제가 좀 나아지긴 한다.
	- Analytical query processing 도 여러 node 에 parallel 하게 쭉 돌리면 되고
	- Transaction query processing 이 analytics 에 주는 영향도 훨씬 덜해질 것이다.