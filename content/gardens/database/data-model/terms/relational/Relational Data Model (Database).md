---
tags:
  - database
  - data-model
  - relational-model
date: 2024-07-17
aliases:
  - Relational Data Model
  - Relational Database
  - Relational Database Management System
  - RDBMS
---
> [!info]- 참고한 것들
> - [[01. Relational Model and Algebra|CMU-15445, Intro. to Database Systems]]

## Relational Data Model

- 초기의 [[Database Management System, DBMS (Database)|DBMS]] 의 경우에는 Logical layer (가령 [[Schema (Database)|Schema]] 같은) 와 Physical layer (실제 구현) 간에 너무 coupling 이 심했다고 한다.
	- 그래서 schema 가 변경되면 DBMS 코드를 수정해야 하는 문제가 있었다.
	- 물론 근데 이것은 인간의 노동력이 컴퓨터보다 더 쌌기 때문에 이런 단순 반복 작업이 가능했던 것.
- 이것을 본 IBM 의 Ted Codd 란 수학자가 생각해낸 것이:
	- 현실 세계를 반영할 수 있는 global 한 "model" 을 만들고, 이 "model" 을 DBMS 에서 구현하면
	- "model" 을 따르는 "schema" 에 대해서는 DBMS 의 수정 없이 편하게 수정할 수 있지 않을까 라고 생각해서
	- 만든 것이 이 *Relational Data Model* 이다.
- Relational Data Model 은 이름 그대로 ==정보들 간의 "관계" 를 이용해 현실세계를 추상화 하는 방법==이고, 아래의 세 핵심 아이디어 (tenet) 를 가진다고 한다:
	- 첫째는 DB 를 "Relation" 이라는 자료구조를 통해 저장한다는 것이고,
	- 둘때는 physical storage 는 DBMS 구현에 맡긴다는 것이며,
		- 즉, 실제로 데이터를 저장하는 것은 B+ tree 를 사용하던, hash tree 를 사용하던 상관없다는 것이다.
	- 셋째는 Relational Model 에서는 data access 를 위한 high-level language 만을 제공하고, 이것의 실제 처리 방법 또한 DBMS 에 맡긴다는 것이다.
		- Relational model 에서는 원하는 결과를 얻을 수 있는 "수학적인 연산자" 형태의 high-level language 를 제시한다.
		- 그리고 그 연산을 어떻게 처리할지는 DBMS 가 알아서 하고 model 에서는 신경쓰지 않음
		- 하지만 이것은 declarative language 를 제시했다는 얘기는 아니다.
- 그리고 다음의 세 가지 정도로 구성된다고 한다.
	- *Structure*: DB 의 relation 과 내용물 등을 ==정의하기 위한 방법==
	- *Integrity*: DB 를 일관된 상태로 유지하기 위한 ==Constraint==
	- *Manipulation*: DB 에 접근하여 조회 및 수정하기 위한 ==API==
- 또한 이러한 data model 을 제공하는 DBMS 는 *Relational Database Management System* (*RDBMS*) 라고 부른다.