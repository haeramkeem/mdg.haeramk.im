---
tags:
  - database
  - db-postgresql
aliases:
  - Main()
---
> [!fail]- 본 글은 #draft 상태입니다.
> - [ ] 내용 정리

> [!info]- 코드 위치 (v17.1)
> - Location
> ```
> src/backend/main/main.c:58
> ```
> - Link: [main()](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/main/main.c#L54-L200)

## Line ref

- [L197](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/main/main.c#L197): [[func PostmasterMain (Postgres Coderef)|PostmasterMain()]] 으로 뛰며 [[Postgres Server, Postmaster (PostgreSQL)|Postmaster]] 의 entrypoint 로 진입한다.