---
tags:
  - database
  - data-model
date: 2024-07-17
aliases:
  - Schema
  - Namespace
---
> [!info]- 참고한 것들
> - [[01. Relational Model and Algebra|CMU-15445, Intro. to Database Systems]]
> - [스댕](https://stackoverflow.com/a/17943883)
> - [Postgres Schema 관련 블로그 글](https://kimdubi.github.io/postgresql/pg_schema/)

## Schema

- *Schema* 는 [[Data Model (Database)|Data Model]] 에 따라 "정의"한 데이터 덩어리를 뜻한다.
	- 이 "정의" 라는 것은 DB 의 메타데이터를 정하는 것,
	- 아니면 더 쉽게 엑셀로 생각하면 Table 의 header row 를 정하는 것이라 생각하면 된다.
- 혹은, SQL-92 표준에 따르면 *Schema* 는 "[[Relation (Relational Model)|Table]] 의 집합으로서 logical 한 [[Cluster, Database (Data Model)|Database]]" 로 정의되며, *Namespace* 라는 말과 같이 사용된다.
	- 이 정의에 따라 PostgreSQL 에서는 `CREATE SCHEMA` 를 하여 database 를 여러개로 나누어 사용할 수 있다.
	- 참고로 MySQL 에서는 이 개념으로 logical database 라는 용어를 사용한다고 한다.