---
tags:
  - database
  - db-postgresql
aliases:
  - table_beginscan
  - table_beginscan()
date: 2024-12-14
---
> [!info]- 코드 위치 (v17.1)
> - File path: `src/include/access/tableam.h`
> - Line: `908`
> - Link: [table_beginscan()](https://github.com/postgres/postgres/blob/REL_17_1/src/include/access/tableam.h#L903-L915)
> - VIM
> ```
> vi src/include/access/tableam.h +908
> ```

## Overview

- [[struct TableScanDesc (Postgres Coderef)|TableScanDesc]] 를 init 하는 함수이다.

## Line Ref

- [L911-L912](https://github.com/postgres/postgres/blob/REL_17_1/src/include/access/tableam.h#L911-L912): Flag 를 설정한다.
	- `SO_TYPE_SEQSCAN`: Sequential scan 임을 명시한다.
	- `SO_ALLOW_STRAT`: Access strategy 를 사용하도록 명시한다.
	- `SO_ALLOW_SYNC`: Sync scan 을 사용하도록 명시한다.
	- `SO_ALLOW_PAGEMODE`: Page 단위로 visibility 를 확인하도록 한다.
- [L914](https://github.com/postgres/postgres/blob/REL_17_1/src/include/access/tableam.h#L914): [[Relation (Relational Model)|Relation]] 의 access method 에 따른 begin scan 함수를 호출해서 [[struct TableScanDesc (Postgres Coderef)|TableScanDesc]] 를 init 한다.
	- 실제로는 여기서 [[func heap_beginscan (Postgres Coderef)|heap_beginscan]] 가 호출된다.