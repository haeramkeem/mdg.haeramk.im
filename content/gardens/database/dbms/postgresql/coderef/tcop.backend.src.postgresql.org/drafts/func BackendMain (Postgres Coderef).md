---
tags:
  - database
  - db-postgresql
aliases:
  - BackendMain()
---
> [!fail]- 본 글은 #draft 상태입니다.
> - [ ] 내용 정리

> [!info]- 코드 위치 (v17.1)
> - Location
> ```
> src/backend/tcop/backend_startup.c:57
> ```
> - Link: [BackendMain()](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/tcop/backend_startup.c#L50-L106)

## Line ref

- [L105](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/tcop/backend_startup.c#L105): 여기서 [[func PostgresMain (Postgres Coderef)|PostgresMain()]] 로 들어가며 [[Backend (Postgres)|Backend]] process 가 본격적으로 시작된다.