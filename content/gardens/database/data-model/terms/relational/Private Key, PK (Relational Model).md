---
tags:
  - database
  - data-model
  - relational-model
date: 2024-07-17
aliases:
  - PK
---
> [!info]- 참고한 것들
> - [[01. Relational Model and Algebra|CMU-15445, Intro. to Database Systems]]

## Private Key

![[Pasted image 20240704104030.png]]

- *Primary Key (PK)* 는 알다시피 ==[[Relation (Relational Model)|relation]] 내에서 [[Relation (Relational Model)|tuple]] 을 고유하게 식별해주는 ID== 이다.
- 보통 name 과 같은 attribute 를 사용하기 보다는 별도의 attribute 를 임의로 만들어서 사용하게 된다.
- 많은 [[Database Management System, DBMS (Database)|DBMS]] 에서는 이 PK 를 자동 생성해 주는 기능을 갖고 있어 사용자가 신경쓰지 않아도 자동으로 중복되지 않는 PK 를 생성해 주게 된다.
	- SQL 표준에서는 `IDENTITY`
	- PostgreSQL 이나 PL-SQL (Oracle) 에서는 `SEQUENCE`
	- MySQL 에서는 `AUTO_INCREMENT` 와 같은 애들이 이런 기능을 제공해 준다