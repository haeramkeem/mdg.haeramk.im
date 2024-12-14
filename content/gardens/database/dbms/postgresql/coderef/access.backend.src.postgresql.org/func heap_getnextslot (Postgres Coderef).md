---
tags:
  - database
  - db-postgresql
aliases:
  - heap_getnextslot
  - heap_getnextslot()
date: 2024-12-15
---
> [!info]- 코드 위치 (v17.1)
> - File path: `src/backend/access/heap/heapam.c`
> - Line: `1310`
> - Link: [heap_getnextslot()](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L1309-L1337)
> - VIM
> ```
> vi src/backend/access/heap/heapam.c +1310
> ```

## Overview

- [[struct TableScanDesc (Postgres Coderef)|TableScanDesc]] 에 명시된 `SO_ALLOW_PAGEMODE` 에 따라 Heap 에서 slot 을 하나 읽어온다.

## Line Ref

- [L1312-L1319](https://github.com/postgres/postgres/blob/91f20bc2f7e4fcf5de5c65a6cb1190e0afa91c0b/src/backend/access/heap/heapam.c#L1312-L1319): `SO_ALLOW_PAGEMODE` 에 따라 [[func heapgettup (Postgres Coderef)|heapgettup()]] 혹은 [[func heapgettup_pagemode (Postgres Coderef)|heapgettup_pagemode()]] 을 호출하여 slot 을 읽어온다.
- [L1321-L1325](https://github.com/postgres/postgres/blob/91f20bc2f7e4fcf5de5c65a6cb1190e0afa91c0b/src/backend/access/heap/heapam.c#L1321-L1325): 만약 읽어온 tuple 이 `NULL` 이라면, 깨끗하게 비운 후 return 한다.
- [L1327-L1332](https://github.com/postgres/postgres/blob/91f20bc2f7e4fcf5de5c65a6cb1190e0afa91c0b/src/backend/access/heap/heapam.c#L1327-L1332): 여기까지 왔으면 정상적인 tuple 이 buffer 에 올라왔다는 것을 의미한다. 따라서 일단 statistics 를 업데이트해주고,
- [L1334-L1336](https://github.com/postgres/postgres/blob/91f20bc2f7e4fcf5de5c65a6cb1190e0afa91c0b/src/backend/access/heap/heapam.c#L1334-L1336): [[func ExecStoreBufferHeapTuple (Postgres Coderef)|ExecStoreBufferHeapTuple]] 으로 buffer 에 있는 tuple 을  [[struct TupleTableSlot (PostgresCoderef)|TTS]] format 으로 바꿔준다.