---
tags:
  - database
date: 2024-07-18
---
> [!info]- 참고한 것들
> - [[01. Modern OLAP Databases|CMU-15721, Advanced Database Systems]]

## 데이터 호수

- 한마디로 말하면, 모든 종류의 데이터 모델에 대한 [[On-Line Analytical Processing, OLAP (Modern Database)|OLAP]] 시스템이라고 할 수 있다.

![[Pasted image 20240708171428.png]]

- [[Data Warehouse (Modern Database)|Data Warehouse]] 와 구별되는 이놈의 가장 큰 특징은 다음과 같다:
	1) 데이터들이 더 이상 [[Relational Data Model (Database)|relation model]] 을 따르지 않아도 된다.
		- 저런 structured data 뿐 아니라,
		- JSON, XML 와 같은 semi-structured,
		- 이미지, 동영상 같은 unstructured 데이터 모두를 핸들링할 수 있다.
	2) Storage 가 [[On-Line Analytical Processing, OLAP (Modern Database)|OLAP]] 내부에서 외부의 object storage 로 분리되었다.
		- 이것은 *Data Lakehouse* 는 더 이상 [[Shared-nothing Architecture (Distributed Computing)|shared-nothing]] 이 아니라는 것을 시사한다.
	3) (2) 의 결과로, *Data Lakehouse* 에서는 더 이상 데이터를 [[On-Line Transactional Processing, OLTP (Modern Database)|OLTP]] 를 통해서만 주입하지 않아도 된다.
		- 즉, [[On-Line Transactional Processing, OLTP (Modern Database)|OLTP]] 가 아닌 client 도 object storage 에 S3 프로토콜 등으로 직접 데이터를 주입하고,
		- 어느 위치에 데이터가 있는지를 [[On-Line Analytical Processing, OLAP (Modern Database)|OLAP]] 의 *Catalog* 란 component 에게 알려주면 그만이다.
	4) (3) 을 위해서, 더 이상 data format 도 proprietary 하지 않다.
		- 이전과 다르게, *Data Lakehouse* 에서는 다양한 [[On-Line Analytical Processing, OLAP (Modern Database)|OLAP]] 솔루션에서 이해할 수 있는 공용의 format 을 이용한다.
			- 여기에는 Parquet 와 ORC 등이 있다.
		- 따라서 이런 format 으로 바꾸기 위해 [[Extract-Transform-Load, ETL (Modern Database)|ETL]] 이 필요할 수도 있지만, 필수적이지는 않다.
- 위와 같은 특징에는 나름의 이유가 있다. 근래에 AI, ML 에 대한 관심이 높아진 것이 한 몫 했다.
	- 이 워크로드같은 경우에는 SQL 이 아닌 방식으로 데이터를 조회하고 저장하는 것이 더 편하다. 근데 무[[Data Warehouse (Modern Database)|Data Warehouse]] 에서는 무조건 [[On-Line Transactional Processing, OLTP (Modern Database)|OLTP]] 를 통해야 하기 때문에, SQL 이 강제되는 측면이 있다.
	- 그리고 이 워크로드에서 생산해 내는 데이터들은 [[Relational Data Model (Database)|relational model]] 을 따르지 않을 때가 많다. 이미지나 영상같은 애들이 많기 때문.
	- 따라서 object storage 에 semi- 혹은 un-structured data 를 S3 프로토콜로 주입하고 [[On-Line Analytical Processing, OLAP (Modern Database)|OLAP]] 에서 분석하는 것이 이전의 방식에 비해 더 낫기 때문.