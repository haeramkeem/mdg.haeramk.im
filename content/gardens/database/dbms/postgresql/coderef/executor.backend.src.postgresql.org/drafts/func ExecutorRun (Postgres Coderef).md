---
tags:
  - database
  - db-postgresql
aliases:
  - ExecutorRun()
---
> [!fail]- 본 글은 #draft 상태입니다.
> - [ ] 내용 정리

> [!info]- 코드 위치 (v16.5)
> - Location
> ```
> src/backend/executor/execMain.c:304
> ```
> - Link: [ExecutorRun()](https://github.com/postgres/postgres/blob/REL_16_5/src/backend/executor/execMain.c#L273-L312)

## Line Ref

- [L308-L309](https://github.com/postgres/postgres/blob/REL_16_5/src/backend/executor/execMain.c#L308-L309): [[Function Pointer (C Type)|Function pointer]] 인 `ExecutorRun_hook` global 변수가 `NULL` 이 아니라면, 이것을 호출하고
- [L311](https://github.com/postgres/postgres/blob/REL_16_5/src/backend/executor/execMain.c#L311): 그렇지 않으면 [[func standard_ExecutorRun (Postgres Coderef)|standard_ExecutorRun()]] 을 호출한다.