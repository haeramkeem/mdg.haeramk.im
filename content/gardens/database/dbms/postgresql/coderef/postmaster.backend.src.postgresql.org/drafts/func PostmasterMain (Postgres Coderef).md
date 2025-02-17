---
tags:
  - database
  - db-postgresql
aliases:
  - PostmasterMain()
---
> [!fail]- 본 글은 #draft 상태입니다.
> - [ ] 내용 정리

> [!info]- 코드 위치 (v17.1)
> - Location
> ```
> src/backend/postmaster/postmaster.c:489
> ```
> - Link: [PostmasterMain()](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/postmaster/postmaster.c#L485-L1380)

## Line ref

- [L1372](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/postmaster/postmaster.c#L1372): [[func ServerLoop (Postgres Coderef)|ServerLoop()]] 으로 뛰며 idle process loop 상태가 된다.