---
tags:
  - database
  - db-postgresql
aliases:
  - CreateTemplateTupleDesc()
date: 2025-02-12
---
> [!info]- 코드 위치 (v17.1)
> - Location
> ```
> src/backend/access/common/tupdesc.c:67
> ```
> - Link: [CreateTemplateTupleDesc()](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/common/tupdesc.c#L59-L101)

## Overview

- [[struct TupleDesc (Postgres Coderef)|TupleDesc]] 를 생성하고 default 값으로 다 초기화해주는 함수이다.

## Line ref

- [L76-L89](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/common/tupdesc.c#L76-L89): TupleDesc 공간을 할당한다.
	- 여기서 눈여겨볼 것은 TupleDesc 에서 `attrs` 전까지의 길이 (`offsetof(struct TupleDescData, attrs)`) 와
	- 인자로 받은 [[Record (Relational Model)|Attribute]] 개수 만큼의 [[struct Form_pg_attribute (Postgres Coderef)|FormData_pg_attribute]] 공간 크기 (`natts * sizeof(FormData_pg_attribute)`) 의 합을 할당하고 있는 것을 알 수 있다.
	- 즉, TupleDesc 의 struct definition 상에서는 `attrs` 가 fixed-sized array 이지만 실제로는 variable-sized 인 것.
- [L91-L98](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/common/tupdesc.c#L91-L98): TupleDesc 의 나머지 field 들을 기본값으로 초기화한다.