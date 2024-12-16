---
tags:
  - database
  - db-postgresql
aliases:
  - read_stream_begin_relation
  - read_stream_begin_relation()
date: 2024-12-15
---
> [!info]- 코드 위치 (v17.1)
> - File path: `src/backend/storage/aio/read_stream.c`
> - Line: `377`
> - Link: [read_stream_begin_relation()](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L367-L528)
> - VIM
> ```
> vi src/backend/storage/aio/read_stream.c +377
> ```

## Overview

- [[struct ReadStream (Postgres Coderef)|ReadStream]] 를 init 하는 함수이다.

## Line Ref

- [L396-L419](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L396-L419): `max_ios` 의 값을 결정한다.
- [L421-L442](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L421-L442): `max_pinned_buffers` 의 값을 결정한다.
- [L444-L450](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L444-L450): `queue_size` 의 값을 결정한다.
- [L452-L471](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L452-L471): [[struct ReadStream (Postgres Coderef)|ReadStream]] struct 및, circular queue (`buffer`, `ios`) 를 생성한다.
- [L475-L484](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L475-L484): [[Advice (OS)|fadvice]] 를 사용할 수 있는지 판단한다.
- [L487-L493](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L487-L493): 만약 여기까지 왔는데 `max_ios` 가 0이라면, 그것은 `max_ios=1` 이고 [[Advice (OS)|fadvice]] 가 비활성화되어있는것으로 간주된다. 따라서 `max_ios=0` 이라면, `max_ios=1` 로 설정한다.
- [L495-L501](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L495-L501): 위에서 결정한 값들을 이용해 [[struct ReadStream (Postgres Coderef)|ReadStream]] struct 의 field 를 설정한다.
- [L503-L511](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L503-L511): `distance` 의 값을 결정하고 [[struct ReadStream (Postgres Coderef)|ReadStream]] struct 의 field 에도 설정한다.
- [L513-L525](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L513-L525): `ios` circular buffer 의 각 entry 를 설정한다.