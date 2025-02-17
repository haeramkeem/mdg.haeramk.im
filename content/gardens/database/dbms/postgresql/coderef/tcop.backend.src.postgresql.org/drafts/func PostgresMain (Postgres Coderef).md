---
tags:
  - database
  - db-postgresql
  - draft
aliases:
  - PostgresMain()
  - BackendRun()
---
> [!fail]- 본 글은 #draft 상태입니다.
> - [ ] 내용 정리

> [!info]- `BackendRun` 은 여기로 redirect 됩니다.
> - 왜냐면 `BackendRun` 에서는 argument 를 설정하고 `PostgresMain` 을 호출하는게 전부이기 때문.
> - `BackendRun` 의 코드 위치:
> - File path
> ```
> ./src/backend/postmaster/postmaster.c
> ```
> - Line: `4456`
> - Link: [BackendRun()](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/postmaster/postmaster.c#L4449-L4465)

> [!info]- 코드 위치 (v16.4)
> - File path
> ```
> src/backend/tcop/postgres.c
> ```
> - Line: `4176`
> - Link: [PostgresMain()](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/tcop/postgres.c#L4164-L4950)

## Overview

- Postgres 의 [[Backend (Postgres)|Backend process]] 가 `fork()` 된 직후 실행하게 되는 entrypoint 이다.