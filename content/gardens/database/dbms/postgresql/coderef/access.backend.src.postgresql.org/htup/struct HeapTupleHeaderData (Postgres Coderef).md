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
> ```
> src/include/access/htup_details.h:155
> ```
> - Link: [struct HeapTupleHeaderData](https://github.com/postgres/postgres/blob/REL_17_1/src/include/access/htup_details.h#L153-L181)

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

> [!fail] #draft 비어있는 field 는 나중에 정리합니다.

- `t_choice`: #draft
- `t_ctid`: #draft
- `t_infomask2`: #draft
- `t_infomask`: #draft
- `t_hoff`: 여기서 *hoff* 는 header offset 이라고 생각하면 된다. `HeapTupleHeaderData` 이후에 계속해서 실제 tuple 에 대한 데이터가 이어지기 때문에, (즉, 이 header 와 data 가 연속된 주소 공간에 있고 `HeapTupleHeaderData` 는 header 만에 대한 struct 이기 때문에) data 를 참고하기 위해서는 이 `t_hoff` 에서 header 의 사이즈가 얼마인지 보고 바로 해당 offset 으로 뛰면 되는 것이다.
- `t_bits`: NULL bitmap 이다.

## Heap tuple data

- 이름에서부터 "Heap tuple header" 인 만큼, 이 struct 에 뒤이어서는 실제 data 들이 등장한다.
- 그래서 이 data 에 접근할 때는, 다음과 같이 할 수 있다:
	- 만약 `HeapTupleHeader htup_hdr` 가 있다고 할 때, 아래와 같은 방식으로 data 가 있는 메모리 주소에 참조할 수 있다.

```c
char *data_ptr = (char*)(htup_hdr) + htup_hdr->t_hoff;
```