---
tags:
  - database
  - db-postgresql
aliases:
  - TupleDescInitEntry()
---
> [!info]- 코드 위치 (v17.1)
> - Location
> ```
> src/backend/access/common/tupdesc.c:651
> ```
> - Link: [TupleDescInitEntry()](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/common/tupdesc.c#L635-L718)

## Overview

- [[struct TupleDesc (Postgres Coderef)|TupleDesc]] 를 생성하고 default 값으로 다 초기화해주는 함수이다.

## Line ref

- [L676](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/common/tupdesc.c#L676): [[Relation (Relational Model)|Relation]] ID 는 0으로 초기화한다.
- [L678-L686](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/common/tupdesc.c#L678-L686): [[Record (Relational Model)|Attribute]] 이름을 복사한다.
- [L688-L692](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/common/tupdesc.c#L688-L692): Type mod (`typmod`), attribute number (`attributeNumber`), attribute dimension (`attdim`) 에 대해 인자로 받은 값들로 TupleDesc 의 field 를 채워준다.
- [L688-L692](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/common/tupdesc.c#L694-L702): TupleDesc field 들의 여러 값들을 기본값으로 채워준다.
	- 어떤 값들인지는 여기서 설명하는게 의미가 없을 것 같다. 코드를 직접 보자.
- [L704-L717](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/common/tupdesc.c#L704-L717): Tuple type 에 대해 [[Cluster, Database (Data Model)|System Catalog]] 에서 읽어와서 TupleDesc field 들을 채워준다.
	- #draft 이놈들이 뭔지는 나중에 정리하자.