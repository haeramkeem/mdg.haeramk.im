---
tags:
  - database
  - db-postgresql
aliases:
  - Tablespace
date: 2025-02-12
---
> [!info]- 참고한 것들
> - [공문](https://www.postgresql.org/docs/current/manage-ag-tablespaces.html)
> - [Postgres 한국 사용자 가이드](https://postgresql.kr/docs/9.5/manage-ag-tablespaces.html)

## Physical Location of Tables

- *Tablespace* 는 database object 들 (가령 [[Relation (Relational Model)|Table]]) 이 저장 물리적인 공간에 대한 abstraction 이다.
	- 간단하게 말하면, 파일시스템 경로라고 생각하면 된다.
- 기본적으로 사용할 수 있는 `pg_default` 와 [[Cluster, Database (Data Model)|System Catalog]] 들이 저장되는 `pg_global` 이 있다.
- 그리고 다음의 SQL 으로 새로 생성할 수도 있다고 한다.

```sql
CREATE TABLESPACE tablespace_name LOCATION '/path/to/tablespace';
```