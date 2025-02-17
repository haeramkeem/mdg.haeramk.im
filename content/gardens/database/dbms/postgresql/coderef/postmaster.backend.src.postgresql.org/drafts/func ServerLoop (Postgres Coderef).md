---
tags:
  - database
  - db-postgresql
aliases:
  - ServerLoop()
---
> [!fail]- 본 글은 #draft 상태입니다.
> - [ ] 내용 정리

> [!info]- 코드 위치 (v17.1)
> - Location
> ```
> src/backend/postmaster/postmaster.c:1624
> ```
> - Link: [ServerLoop()](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/postmaster/postmaster.c#L1620-L1827)

## Line ref

- [L1674](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/postmaster/postmaster.c#L1674): [[func BackendStartup (Postgres Coderef)|BackendStartup()]] 으로 뛰며 [[type Backend (Postgres Coderef)|Backend]] process 를 fork 한다.