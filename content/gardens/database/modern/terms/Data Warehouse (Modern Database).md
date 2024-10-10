---
tags:
  - database
date: 2024-07-17
---
> [!info]- 참고한 것들
> - [[01. Modern OLAP Databases|CMU-15721, Advanced Database Systems]]

## 데이터 창고

- 한마디로 말하면, [[Relational Data Model (Database)|Relational data]] 를 위한 [[On-Line Analytical Processing, OLAP (Modern Database)|OLAP]] 시스템이라고 할 수 있다.
	- 그래서 이름이 "창고" 인 것: 데이터들이 정리정돈 되어 있기 때문에.

![[Pasted image 20240708162624.png]]

- 이놈에게는 몇가지 특징이 있다.
	1) 우선 위에서 말한 대로 데이터는 [[Relational Data Model (Database)|relational data model]] 을 따른다.
	2) 데이터 소스는 [[On-Line Transactional Processing, OLTP (Modern Database)|OLTP]] 이다.
		- 즉, 어떤 데이터를 *Data Warehouse* 에서 사용하기 위해서는 반드시 OLTP 를 거쳐야 한다.
	3) *Proprietary data format* 을 가진다.
		- Data Warehouse 에 저장된 데이터는 해당 *Data Warehouse* 솔루션에서만 사용할 수 있는 data format 이다.
		- 즉, 해당 데이터는 vendor lock-in 이 걸린다는 것.
	4) [[Extract-Transform-Load, ETL (Modern Database)|ETL]] 이 필요하다.
		- 즉, OLTP 의 데이터를 Data Warehouse 에서 사용하기 위해서 중간에 낀 ETL 이:
			- Row-store 를 column-store 로 변환해 주고,
			- 해당 OLTP 솔루션이 사용하고 있는 data format 을 Data Warehouse 에서 이해할 수 있는 data format (3번에서의 *proprietary data format*) 으로 변환한다.
		- 효과적인 ETL 을 위해, 그리고 Data Warehouse 시스템이 모든 데이터들에 대해 주도권을 갖고 있게 하기 위해 OLTP 에 데이터가 주입되기 전에 Schema 가 다 저장되어야 한다고 한다.
	5) [[Shared-nothing Architecture (OS)|Shared-nothing 아키텍쳐]] 를 가진다.
		- 즉, 여러 대의 compute node 들이 공유 디스크를 사용하는 것이 아니라 각자의 local disk 에서 전체 데이터의 일부분을 저장하고 처리한다.
		- 이 점은 scalability 가 낮다는 점에서 단점으로 꼽히기도 한다.
- 상당수의 *Data Warehouse* 솔루션들이 기존의 Monolithic DBMS 를 analytic-friendly 하게 커스텀하여 사용한다.
	- 가령 대부분의 시스템들이 PostgreSQL 를 기반으로 하고 있다고 한다.
	- 일례로, Data Warehouse 중 하나인, monetDB 는 PostgreSQL 을 fork 해서 만들었고 이것은 추후에 DuckDB 가 된다.
		- 이게 DuckDB 가 PostgreSQL 과 유사한 인터페이스를 가지고 있는 이유이다.