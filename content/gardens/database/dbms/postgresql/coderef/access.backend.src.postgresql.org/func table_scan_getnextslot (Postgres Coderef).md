---
tags:
  - database
  - db-postgresql
aliases:
  - table_scan_getnextslot
  - table_scan_getnextslot()
---
> [!info]- 코드 위치 (v17.1)
> - File path: `src/include/access/tableam.h`
> - Line: `1055`
> - Link: [table_scan_getnextslot()](https://github.com/postgres/postgres/blob/REL_17_1/src/include/access/tableam.h#L1051-L1072)
> - VIM
> ```
> vi src/include/access/tableam.h +1055
> ```

## Overview

- Relation 의 설정된 access method 에 맞는 방법으로 table scan 을 해서 다음 slot 을 읽어온다.

## Line Ref

- [L1057](https://github.com/postgres/postgres/blob/REL_17_1/src/include/access/tableam.h#L1057): Table ID 를 slot 에 설정한다.
- [L1059-L1061](https://github.com/postgres/postgres/blob/REL_17_1/src/include/access/tableam.h#L1059-L1061): Scan direction 이 forward, backward 둘 중 하나인지 확인한다.
- [L1063-L1069](https://github.com/postgres/postgres/blob/REL_17_1/src/include/access/tableam.h#L1063-L1069): #draft Valid 한 `CheckXidAlive` 을 가진 놈이 이 함수를 호출하는 것은 원치 않는 작동방식이라고 한다.
- [L1071](https://github.com/postgres/postgres/blob/REL_17_1/src/include/access/tableam.h#L1071): Relation 에 설정된 access method 으로 table scan 을 해서 다음 slot 을 읽어온다.
	- 실제로는 여기에서 [[func heap_getnextslot (Postgres Coderef)|heap_getnextslot]] 을 호출하게 된다.
