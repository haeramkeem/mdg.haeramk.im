---
tags:
  - database
  - db-postgresql
aliases:
  - heap_fetch_next_buffer
  - heap_fetch_next_buffer()
---
> [!info]- 코드 위치 (v17.1)
> - File path: `src/backend/access/heap/heapam.c`
> - Line: `594`
> - Link: [heap_fetch_next_buffer()](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L587-L629)
> - VIM
> ```
> vi src/backend/access/heap/heapam.c +594
> ```

## Overview

- Heap file 에서 새로운 block 을 가져올 때, read stream mode 로 다음 buffer 를 갖고오게 하는 함수이다.
- 기능적으로는 scan direction 을 지정하고, [[struct ReadStream (Postgres Coderef)|Read Stream Mode]] 로 buffer 를 갖고오게 한다.

## Line Ref

- [L596](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L596): [[struct ReadStream (Postgres Coderef)|ReadStream]] 가 있는지 확인한다.
- [L598-L603](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L598-L603): Current buffer 에 이미 buffer 가 등록되어 있으면 해제한다.
- [L605-L610](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L605-L610): Interrupt check 를 수행한다.
- [L612-L622](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L612-L622): 만약에 scan 방향이 바뀐다면, 지금까지의 read stream 을 전부 취소해서 새로운 read stream 이 시작되게 한다.
- [L626-L628](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L626-L628): [[func read_stream_next_buffer (Postgres Coderef)|read_stream_next_buffer()]] 을 호출해 read stream 에서 다음 buffer 를 갖고온다.

## Caller

- [[func heapgettup (Postgres Coderef)|heapgettup()]]
- [[func heapgettup_pagemode (Postgres Coderef)|heapgettup_pagemode()]]