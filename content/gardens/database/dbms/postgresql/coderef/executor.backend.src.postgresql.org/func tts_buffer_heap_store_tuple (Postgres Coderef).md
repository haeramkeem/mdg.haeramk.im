---
tags:
  - database
  - db-postgresql
date: 2024-12-15
aliases:
  - tts_buffer_heap_store_tuple
  - tts_buffer_heap_store_tuple()
---
> [!info]- 코드 위치 (v17.1)
> - File path: `src/backend/executor/execTuples.c`
> - Line: `942`
> - Link: [tts_buffer_heap_store_tuple()](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/execTuples.c#L941-L991)
> - VIM
> ```
> vi src/backend/executor/execTuples.c +942
> ```

## Overview

- [[struct HeapTupleData (Postgres Coderef)|HeapTupleData]] 로 대변되는 buffer 내의 tuple (즉, 여러 [[struct HeapTupleHeaderData (Postgres Coderef)|HeapTupleHeaderData]] 와 version tuple 들) 을 [[struct TupleTableSlot (PostgresCoderef)|TTS]] 로 변환하는 역할을 한다.

## Line Ref

- [L945-L954](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/execTuples.c#L945-L954): 만약 `TTS_FLAG_SHOULDFREE` 라면, 인자로 받아 결과물을 담아 caller 에게 전달해줄 `slot` 을 비우는 작업을 한다.
	- [L949-L950](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/execTuples.c#L949-L950): `slot` 의 buffer 는 unpin 되어 있어야 한다. 지금은 안쓰는 buffer 이기 때문.
	- [L952-L953](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/execTuples.c#L952-L953): Tuple 을 free 해주고 `TTS_FLAG_SHOULDFREE` flag 를 꺼준다.
- [L956-L960](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/execTuples.c#L956-L960): 인자로 받은 값들을 이용해 `slot` 의 값들을 채워준다.
- [L962-L990](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/execTuples.c#L962-L990): `slot` 의 buffer 와 새로 읽어온 buffer 가 같은지 다른지 확인해 그에 맞는 처리를 해준다.
	- [L975-L976](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/execTuples.c#L975-L976): 만약 다른데 `slot` 의 buffer 가 valid 하다면, 그놈을 unpin 해준다.
	- [L978](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/execTuples.c#L978): 그리고 `slot` 의 buffer 를 새로 읽어온 buffer 로 해준 뒤
	- [L980-L981](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/execTuples.c#L980-L981): Pinning 을 해준다.
	- [L989](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/execTuples.c#L989): 만약 같다면, caller 가 다시 pinning 해주는게 더 좋다고 한다. 그래서 일단 여기서는 unpinning 한다.