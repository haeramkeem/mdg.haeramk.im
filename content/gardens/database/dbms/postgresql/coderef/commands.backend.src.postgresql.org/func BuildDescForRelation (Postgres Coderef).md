---
tags:
  - database
  - db-postgresql
aliases:
  - BuildDescForRelation()
date: 2025-02-12
---
> [!info]- 코드 위치 (v17.1)
> - Location
> ```
> src/backend/commands/tablecmds.c:1291
> ```
> - Link: [BuildDescForRelation()](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/commands/tablecmds.c#L1283-L1386)

## Overview

- [[struct ColumnDef (Postgres Coderef)|ColumnDef]] list 를 받아 [[struct TupleDesc (Postgres Coderef)|TupleDesc]] 를 생성한다.

## Line ref

- [L1304-L1309](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/commands/tablecmds.c#L1304-L1309): 일단 [[func CreateTemplateTupleDesc (Postgres Coderef)|CreateTemplateTupleDesc()]] 으로 [[struct TupleDesc (Postgres Coderef)|TupleDesc]] 을 하나 생성한다.
- [L1313-L1365](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/commands/tablecmds.c#L1313-L1365): 그리고 [[struct ColumnDef (Postgres Coderef)|ColumnDef]] list 를 순회하며 TupleDesc 에 [[Record (Relational Model)|Attribute]] 를 하나씩 추가한다.
	- [L1319-L1327](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/commands/tablecmds.c#L1319-L1327): `attname` (attribute name), `atttypid` (attribute type ID), `atttypmod` (attribute type mod) 정보를 받아온다.
	- [L1329-L1331](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/commands/tablecmds.c#L1329-L1331): ACL (Access Control List) 를 확인한다. 즉, 현재 user 가 object 에 권한이 있는지 체크한다.
	- [L1333-L1344](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/commands/tablecmds.c#L1333-L1344): `attcollation` 하고 `attdim` 정보를 받아온다.
		- #draft 이게 뭔지는 모르겠다.
	- [L1346-L1347](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/commands/tablecmds.c#L1346-L1347): [[func TupleDescInitEntry (Postgres Coderef)|TupleDescInitEntry()]] 을 이용해 TupleDesc 의 값들을 채워준다.
	- [L1348-L1364](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/commands/tablecmds.c#L1348-L1364): [[func TupleDescInitEntry (Postgres Coderef)|TupleDescInitEntry()]] 가 채워주지 않는 값들을 [[struct ColumnDef (Postgres Coderef)|ColumnDef]] 에서 가져와 채워준다.
- [L1367-L1383](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/commands/tablecmds.c#L1367-L1383): 위의 list 를 순회하는 과정에서 [[struct ColumnDef (Postgres Coderef)|ColumnDef]] 의 `is_not_null` 가 `TRUE` 인 놈을 발견하면 `has_not_null` flag 가 켜진다. 만약에 이 flag 가 켜져있다면, 여기에서 not null constraint 를 추가해 준다.