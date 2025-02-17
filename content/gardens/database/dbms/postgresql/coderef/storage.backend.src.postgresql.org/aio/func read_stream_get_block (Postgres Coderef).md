---
tags:
  - database
  - db-postgresql
aliases:
  - read_stream_get_block
  - read_stream_get_block()
date: 2024-12-15
---
> [!info]- 코드 위치 (v17.1)
> - File path: `src/backend/storage/aio/read_stream.c`
> - Line: `171`
> - Link: [read_stream_get_block()](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L166-L184)
> - VIM
> ```
> vi src/backend/storage/aio/read_stream.c +171
> ```

## Overview

- [[struct ReadStream (Postgres Coderef)|ReadStream]] 에 등록된 `callback` 을 호출하여 다음으로 fetch 해올 block 의 번호를 받아온다.

## Line Ref

- [L173-L177](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L173-L177): 만약 현재 client 가 사용하고 있는 block (`stream->buffered_blocknum`) 이 invalid 라면, invalid 를 return 한다.
- [L178-L181](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L178-L181): 만약 그렇지 않다면, `stream->callback` [[Function Pointer (C Type)|Function pointer]] 로 callback 함수를 호출하여 다음 block 번호를 받아온다.
	- 만약 [[struct ReadStream (Postgres Coderef)|ReadStream]] 이 [[func heap_beginscan (Postgres Coderef)|heap_beginscan()]] 을 통해 생성되었다면, 이 callback 으로 [[func heap_scan_stream_read_next_serial (Postgres Coderef)|heap_scan_stream_read_next_serial()]] 이 호출된다.