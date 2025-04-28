---
tags:
  - database
  - db-postgresql
aliases:
  - TupleDesc
  - struct TupleDesc
date: 2025-02-12
---
> [!info]- 코드 위치 (v17.1)
> - Location
> ```
> src/include/access/tupdesc.h:79
> ```
> - Link: [struct TupleDesc](https://github.com/postgres/postgres/blob/REL_17_1/src/include/access/tupdesc.h#L48-L89)

## Overview

- [[type Backend (Postgres Coderef)|Backend]] 에서 사용하는 [[Record (Relational Model)|Tuple]] 의 구조에 대한 metadata 객체이다.
	- 이 "구조" 라 함은 간단하게 tuple 의 [[Record (Relational Model)|Attribute]] 개수 및 정보, [[Constraint (Database)|Constraint]] 라고 생각하면 된다.
- Disk 에서 읽어온 relation 의 tuple 의 경우에는 [[Cluster, Database (Data Model)|System Catalog]] 에서 정보를 읽어온다.
	- 이때 참조하는 catalog 는 `pg_attribute`, `pg_attrdef`, `pg_constraint` 라고 한다.
- 그리고 그렇지 않은 경우에는 (가령 query result 라던가) constraint 정보가 빠지게 된다고 한다.
	- 즉, attribute 정보는 다 들어가 있지만 constraint 는 빠진다는 것.

## Field Ref

- `natts`: Attribute 의 개수
- `tdtypeid`: #draft 몰라잉
- `tdtypmod`: #draft 이것도 몰라잉
- `tdrefcount`: Tuple descriptor 의 reference count
- `constr`: Tuple contraint 정보
	- 이놈에 대해서는 만약 constraint 가 없거나 위에서 말한 대로 query result 같은 on-disk tuple 의 경우에는 `NULL` 로 설정된다.
- `attrs`: Tuple attribute 정보
	- 이것은 [[struct FormData_pg_attribute (Postgres Coderef)|FormData_pg_attribute]] 의 배열로 정의되어 각 attribute 에 대한 정보를 저장된다.
	- 이때 `struct` definition 상에서는 fixed-sized array 이나, [[func CreateTemplateTupleDesc (Postgres Coderef)|CreateTemplateTupleDesc()]] 에서 보면 variable-sized 로 할당해주고 있는 것을 알 수 있다.