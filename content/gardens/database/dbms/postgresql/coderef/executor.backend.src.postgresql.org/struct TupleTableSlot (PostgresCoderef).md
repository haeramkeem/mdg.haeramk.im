---
tags:
  - database
  - db-postgresql
date: 2024-12-15
aliases:
  - TupleTableSlot
  - struct TupleTableSlot
  - TTS
  - VirtualTupleTableSlot
  - HeapTupleTableSlot
  - BufferHeapTupleTableSlot
  - MinimalTupleTableSlot
---
> [!info]- 코드 위치 (v17.1)
> - `TupleTableSlot`:
> 	- File path: `src/include/executor/tuptable.h`
> 	- Line: `114`
> 	- Link: [struct TupleTableSlot](https://github.com/postgres/postgres/blob/REL_17_1/src/include/executor/tuptable.h#L113-L131)
> ```
> src/include/executor/tuptable.h:114
> ```
> - `TupleTableSlot` Implementations:
> 	- File path: `src/include/executor/tuptable.h`
> 	- Line: `244` (`VirtualTTS`), `253` (`HeapTTS`), `267` (`BufferHeapTTS`), `282` (`MinimalTTS`)
> 	- Link: [struct TupleTableSlot (implementations)](https://github.com/postgres/postgres/blob/REL_17_1/src/include/executor/tuptable.h#L240-L301)
> ```
> src/include/executor/tuptable.h:244
> src/include/executor/tuptable.h:253
> src/include/executor/tuptable.h:267
> src/include/executor/tuptable.h:282
> ```

## Overview

- `TupleTableSlot` (줄여서 `tts`) 는 [[Materialization (Database Query Plan)|Materialization]] 된 tuple 이라고 생각하면 된다.
- 즉, disk (그리고 그게 memory 로 올라온 buffer) 에서의 format 이 아닌, query execution 에서 갖고다니는 format 을 말한다.
- 크게 네 종류가 있다.
	- 여기서 `base` 라는 field 가 나오게 되는데, 간단하게 생각하면 OOP 에서 상속이라고 생각하면 된다.

### `VirtualTupleTableSlot`

```
+---------------------+
| TupleTableSlot base |
+---------------------+
```

- 이놈은 TTS 만 들고있는 놈을 말한다.

### `HeapTupleTableSlot`

```
+---------------------+
| TupleTableSlot base |
+---------------------+
| HeapTuple     tuple |
+---------------------+
```

- 이놈은 TTS 에 [[struct HeapTupleData (Postgres Coderef)|HeapTupleData]] 까지 들고있는 놈을 말한다.

### `BufferHeapTupleTableSlot`

```
+-------------------------+
| HeapTupleTableSlot base |
+-------------------------+
| Buffer           buffer |
+-------------------------+
```

- 이놈은 위의 [[#`HeapTupleTableSlot`|HeapTupleTableSlot]] 에 buffer 까지 들고있는 놈을 말한다.
	- 즉, tuple data access 는 저 buffer 로 가게 된다.

### `MinimalTupleTableSlot`

```
+-----------------------+
| TupleTableSlot   base |
+-----------------------+
| MinimalTuple mintuple |
+-----------------------+
```

- 이놈은 TTS 에 tuple 의 축소판인 `MinimalTuple` 을 들고있는 놈을 말한다.

## Field Ref

> [!fail] #draft 나중에 정리합니다.