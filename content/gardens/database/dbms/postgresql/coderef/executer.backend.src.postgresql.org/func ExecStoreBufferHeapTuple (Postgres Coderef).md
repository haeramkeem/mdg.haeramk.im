---
tags:
  - database
  - db-postgresql
date: 2024-12-15
aliases:
  - ExecStoreBufferHeapTuple
  - ExecStoreBufferHeapTuple()
---
> [!info]- 코드 위치 (v17.1)
> - File path: `src/backend/executor/execTuples.c`
> - Line: `1479`
> - Link: [ExecStoreBufferHeapTuple()](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/execTuples.c#L1459-L1498)
> - VIM
> ```
> vi src/backend/executor/execTuples.c +1479
> ```

## Overview

- 이놈의 목적은 buffer pool 에 [[struct HeapTupleHeaderData (Postgres Coderef)|HeapTupleHeaderData]] 의 형태로 존재하는 데이터 및 그에 대한 version chain head 인 [[struct HeapTupleData (Postgres Coderef)|HeapTupleData]] 를 [[struct TupleTableSlot (PostgresCoderef)|BufferHeapTupleTableSlot]] 로 바꿔주는데 있는데,
- 사실상 이놈은 그냥 징검다리고 실제 작업은 [[func tts_buffer_heap_store_tuple (Postgres Coderef)]] 에서 한다.

## Line Ref

- [L1483-L1492](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/execTuples.c#L1483-L1492): [[struct TupleTableSlot (PostgresCoderef)|BufferHeapTupleTableSlot]] 으로 바꿔주기 위한 조건들을 체크한다. 가령,
	- 인자로 받은 `tuple`, `slot`, 그리고 `buffer` 가 모두 정상이어야 하고
	- 다른 [[struct TupleTableSlot (PostgresCoderef)|TTS]] 가 아닌 [[struct TupleTableSlot (PostgresCoderef)|BufferHeapTTS]] 로 바꿀 것이기 때문에, 인자로 받 (아서 결과물로 caller 에게 전달할) `slot` 이 해당 type 인지 확인한다.
- [L1493-L1497](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/execTuples.c#L1493-L1497): [[func tts_buffer_heap_store_tuple (Postgres Coderef)|tts_buffer_heap_store_tuple()]] 를 호출해서 바꿔준다.