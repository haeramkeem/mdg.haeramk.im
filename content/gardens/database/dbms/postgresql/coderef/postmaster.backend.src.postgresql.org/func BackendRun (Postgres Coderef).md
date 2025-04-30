---
tags:
  - database
  - db-postgresql
  - draft
aliases:
  - BackendRun()
date: 2025-04-30
---
> [!info]- 코드 위치 (v16.4)
> - Location
> ```
> src/backend/postmaster/postmaster.c:4456
> ```
> - Link: [BackendRun()](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/postmaster/postmaster.c#L4449-L4465)

## Overview

- 이놈이 하는 일은 아주 간단하다: memory context 를 바꾸고 [[func PostgresMain (Postgres Coderef)|PostgresMain()]] 을 호출해주는게 다이다.

## Line Ref

- [L4462](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/postmaster/postmaster.c#L4462): [[func MemoryContextSwitchTo (Postgres Coderef)|func MemoryContextSwitchTo (Postgres Coderef)]] 로 memory context 를 바꾼다.
- [L4464](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/postmaster/postmaster.c#L4464): [[func PostgresMain (Postgres Coderef)|PostgresMain()]] 을 호출한다.