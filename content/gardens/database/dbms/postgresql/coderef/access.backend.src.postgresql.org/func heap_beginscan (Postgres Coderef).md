---
tags:
  - database
  - db-postgresql
aliases:
  - heap_beginscan
  - heap_beginscan()
date: 2024-12-14
---
> [!info]- 코드 위치 (v17.1)
> - File path: `src/backend/access/heap/heapam.c`
> - Line: `1047`
> - Link: [heap_beginscan()](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L1046-L1158)
> - VIM
> ```
> vi src/backend/access/heap/heapam.c +1047
> ```

## Overview

- Heap scan 에 필요한 [[struct TableScanDesc (Postgres Coderef)|TableScanDesc]] 를 설정한다.

## Line Ref

- [L1054-L1061](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L1054-L1061): Relation 에 대한 reference count 를 올린다.
- [L1063-L1075](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L1063-L1075): [[struct TableScanDesc (Postgres Coderef)|TableScanDesc]] 를 생성하고, 함수 인자로 받은 값들로 각 field 를 채운다.
- [L1083-L1105](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L1083-L1105): [[Phantom Read (Database Transaction)|Phantom Read]] 를 막기 위해, relation 전체에 대한 predicate lock 을 잡는다.
- [L1107-L1108](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L1107-L1108): Table ID 를 설정한다.
- [L1110-L1117](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L1110-L1117): Parallel worker 들을 사용한다면, 얘네들을 위한 memory 공간을 할당한다.
- [L1119-L1128](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L1119-L1128): [[func initscan (Postgres Coderef)|initscan]] 을 호출해서 common 한 값들을 설정한다.
- [L1132-L1153](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L1132-L1153): Sequential scan 일 경우에 [[struct ReadStream (Postgres Coderef)|Read stream mode]] 를 사용하여 scan 하기 위해  [[gardens/database/dbms/postgresql/coderef/storage.backend.src.postgresql.org/aio/func read_stream_begin_relation (Postgres Coderef)|read_stream_begin_relation]] 를 호출하여 [[struct ReadStream (Postgres Coderef)|ReadStream]] 을 init 한다.
	- 여기서 [[struct ReadStream (Postgres Coderef)|ReadStream]] 의 `callback` 을 [[func heap_scan_stream_read_next_parallel (Postgres Coderef)|heap_scan_stream_read_next_parallel]] 혹은 [[gardens/database/dbms/postgresql/coderef/access.backend.src.postgresql.org/drafts/func heap_scan_stream_read_next_serial (Postgres Coderef)|heap_scan_stream_read_next_serial]] 로 설정한다.