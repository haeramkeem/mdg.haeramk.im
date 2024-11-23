---
tags:
  - database
  - db-postgresql
aliases:
  - PostgresMain
---
> [!fail]- 본 글은 #draft 상태입니다.
> - [ ] 내용 정리

> [!info] 코드 위치
> - File path
> ```
> ./src/backend/tcop/postgres.c
> ```
> - Line: `4176`
> - Link: [PostgresMain()](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/tcop/postgres.c#L4164-L4950)

## Overview

- Postgres 의 [[Backend (Postgres)|Backend process]] 가 `fork()` 된 직후 실행하게 되는 entrypoint 이다.