---
tags:
  - database
  - db-postgresql
date: 2024-12-15
aliases:
  - HeapTupleHeaderData
  - struct HeapTupleHeaderData
  - HeapTupleHeader
---
> [!info]- 코드 위치 (v17.1)
> - File path: `src/include/access/htup_details.h`
> - Line: `153`
> - Link: [struct HeapTupleHeaderData](https://github.com/postgres/postgres/blob/REL_17_1/src/include/access/htup_details.h#L153-L181)
> - VIM
> ```
> vi src/include/access/htup_details.h +155
> ```

## Overview

- Disk 에 저장되는 version tuple 의 header format 이 `HeapTupleHeaderData` 이고, buffer pool 에 올라온 이 `HeapTupleHeaderData` 에 대한 pointer 를 `typedef` 해놓은게 `HeapTupleHeader` 이다.
- 즉, disk 에는 다음처럼 저장된다는 것.

```
+------------------------------+----------+
| HeapTupleHeaderData (t_ctid) | Data ... |
+-------------------------|----+----------+
                          |
  +-----(next version)----+
  |
  |    +---------------------+----------+
  +--> | HeapTupleHeaderData | Data ... |
       +---------------------+----------+
```

- 여기서 "version" 에 집중하자. 이놈은 하나의 (physical) version tuple 에 대한 header 이고, 이 version 들이 모인 (logical) record 에 대한 자료구조는 [[struct HeapTupleData (Postgres Coderef)|HeapTupleData]] 이다.
	- 즉, 하나의 (physical) version tuple 에 대한 자료구조가 `HeapTupleHeaderData` 이고,
	- 얘네들이 모인 하나의 (logical) record 를 가리키는 자료구조가 [[struct HeapTupleData (Postgres Coderef)|HeapTupleData]] 이다.

## Field Ref

> [!fail] #draft 나중에 정리합니다.