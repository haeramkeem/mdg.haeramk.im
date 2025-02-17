---
tags:
  - database
  - db-postgresql
aliases:
  - FormData_pg_attribute
  - struct FormData_pg_attribute
  - Form_pg_attribute
date: 2025-02-12
---
> [!info]- 코드 위치 (v17.1)
> - Location (`struct FormData_pg_attribute`)
> ```
> src/include/catalog/pg_attribute.h:37
> ```
> - Link: [struct FormData_pg_attribute](https://github.com/postgres/postgres/blob/REL_17_1/src/include/catalog/pg_attribute.h#L28-L193)
> - Location (pointer `Form_pg_attribute`)
> ```
> src/include/catalog/pg_attribute.h:209
> ```
> - Link: [Form_pg_attribute](https://github.com/postgres/postgres/blob/REL_17_1/src/include/catalog/pg_attribute.h#L204-L209)

## Overview

- [[Cluster, Database (Data Model)|System Catalog]] 에 있는 attribute 정보에 대한 구조체이다.
- Struct definition 이 `FormData_pg_attribute` 이고 이놈에 대한 pointer 를 alias (`typedef`) 한 것이 `Form_pg_attribute` 이다.

## Field Ref

> [!fail] #draft 나중에 정리합니다.