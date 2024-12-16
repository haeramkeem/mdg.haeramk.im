---
tags:
  - database
  - db-postgresql
date: 2024-12-15
aliases:
  - HeapTupleData
  - struct HeapTupleData
  - HeapTuple
  - Heap tuple
---
> [!info]- 코드 위치 (v17.1)
> - File path: `src/include/access/htup.h`
> - Line: `62`
> - Link: [struct HeapTupleData](https://github.com/postgres/postgres/blob/REL_17_1/src/include/access/htup.h#L30-L71)
> - VIM
> ```
> vi src/include/access/htup.h +62
> ```

## Overview

- 하나의 (logical) record 에 대한 (physical) version tuple (즉, [[struct HeapTupleHeaderData (Postgres Coderef)|HeapTupleHeaderData]]) chain 의 head 를 나타내는 자료구조이다.
- 얘는 disk 에 저장되지는 않는다. Buffer pool 에 올라오면 그때 생성된다는 것.

```
+------------------------+
| HeapTupleData (t_self) |
+-------------------|----+
                    |
  +-(first version)-+
  |
  |    +------------------------------+----------+
  +--> | HeapTupleHeaderData (t_ctid) | Data ... |
       +-------------------------|----+----------+
                                 |
    +-------(next version)-------+
    |
    |    +---------------------+----------+
    +--> | HeapTupleHeaderData | Data ... |
         +---------------------+----------+
```

- 그리고 이놈에 대한 pointer 를 `typedef` 해놓은게 `HeapTuple` 이다.

## Field Ref

> [!fail] #draft 나중에 정리합니다.