---
tags:
  - database
date: 2024-07-18
---
> [!info]- 참고한 것들
> - [[01. Modern OLAP Databases|CMU-15721, Advanced Database Systems]]

## "Analytical" Processing

- 여기서 "분석 (Analytics)" 라는 것을 좀 더 구체적으로 말하면, ==기존에 갖고 있는 데이터를 어떻게 지지고 볶고 해서 새로운 데이터를 생산해 내는 ==것 정도가 되겠다.
- 따라서 *On-Line Analytical Processing* (*OLAP*) 은 이러한 "데이터로 데이터 낳기" 를 온라인 (cloud) 으로 재공해 주는 SaaS 를 말하는 것.
- 따라서 OLAP 에는 우선 지지고 볶고 할 "기반 데이터" 가 필요할 것이다.
	- 가장 흔한 형태는 [[On-Line Transactional Processing, OLTP (Database)|OLTP]] 에 쌓여있는 데이터를 사용하는 것이다.
		- 여기에 있는 데이터를 가져다가, OLAP 에서 사용하기 편한 형태로 변환하여 OLAP 에 넣어 사용하는 것이 일반적이다.
		- 이때의 "OLAP 에서 사용하기 편한 형태로 변환" 을 해주는 놈을 [[Extract-Transform-Load, ETL (Database)|ETL]] 라고 하며,
		- [[Relational Data Model (Database)|Relational]] 데이터의 경우에는 row-store 를 column-store 로 변환하는 작업을 해준다. (더 자세한 내용은 [[Extract-Transform-Load, ETL (Database)|ETL]] 문서를 참고하자.)
		- 이렇게 Relational-OLTP 에 ETL + OLAP 를 붙여서 사용하는 것을 [[Data Warehouse (Database)|Data Warehouse]] 라고 부른다.
	- 아니면, 그냥 S3 같은 object storage 에 데이터를 때려넣고, 여기에 OLAP 을 붙일 수도 있다.
		- 이때 때려넣는 데이터는 structured (relational) 에 제한되지 않고 다양하게 넣을 수도 있다.
		- 이러한 방식을 [[Data Lake, Data Lakehouse (Database)|Data Lakehouse]] 라고 한다.