---
tags:
  - database
  - data-model
aliases:
  - Catalog
  - System Catalog
  - Database
  - Cluster
date: 2025-02-11
---
> [!info]- 참고한 것들
> - [스댕](https://stackoverflow.com/a/17943883)
> - [[01. Relational Model and Algebra|CMU-15445, Intro. to Database Systems]]
> - [MongoDB](https://www.mongodb.com/resources/basics/databases/data-lake-vs-data-warehouse-vs-database)

![[Pasted image 20250211174731.png]]

## Cluster

- 하나의 database server instance 를 *Cluster* 라고 한다.
	- 여기서 주의할 것은 [[(Garden) Kubernetes, Cloud|Kubernetes]] 등과 같은 HW 적인 [[Types of Computing (Arch)|cluster]] 와 혼동하면 안된다는 것이다.
	- 여기서의 *Cluster* 는 여러 database 의 모음이라는 의미에서의 cluster 이다.
- Client 와 통신하는 대상이라고 생각하면 된다: Client 는 한번에 하나의 *Cluster* 와 connection 을 맺을 수 있다.

## Database

- *Database* 라는 말의 정의는 "현실 세계의 특정 부분을 반영하는 연관된 데이터들이 정리 정돈된 덩어리" 이다.
	- 즉, Data + structure + real-world aspect 라고 할 수 있는 것.
- 하나의 *Cluster* 에는 여러 *Database* 가 있을 수 있고, 여기에는 여러개의 [[Schema, Namespace (Data Model)|Schema]] 가 들어갈 수 있다.

### Catalog

- 이 *Database* 는 *Catalog* 로 불리기도 하고, [[Database Management System, DBMS (Database)|DBMS]] 내에서 이것에 대한 metadata 를 관리하는 object 는 *System Catalog* 라고도 불린다.