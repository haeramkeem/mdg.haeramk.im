---
tags:
  - database
  - db-postgresql
aliases:
  - initscan
  - initscan()
date: 2024-12-14
---
> [!info]- 코드 위치 (v17.1)
> - File path: `src/backend/access/heap/heapam.c`
> - Line: `303`
> - Link: [initscan()](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L298-L422)
> - VIM
> ```
> vi src/backend/access/heap/heapam.c +303
> ```

## Overview

- Common 한 [[struct TableScanDesc (Postgres Coderef)|TableScanDesc]] 을 설정한다.

## Line Ref

- [L309-L326](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L309-L326): Relation 의 전체 block 수를 저장한다.
	- 이것을 `initscan` 에서 해도 되는 이유는 [[Multiversion Concurrency Control, MVCC (Database Transaction)|MVCC]] 를 이용할 때는 `INSERT` tuple 들은 어차피 안보이기 때문이다.
- [L328-L347](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L328-L347): [[Shared Buffer (PostgreSQL)|Shared Buffer]] 를 사용하고 relation 의 크기가 shared buffer 의 크기의 $1/4$ 보다 크다면, syncscan 과 bulkread 를 사용하게 된다. 따라서 이것을 판단하여 local variable flag `allow_strat` 와 `allow_sync` 를 설정한다.
- [L349-L360](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L349-L360): `allow_strat` 이 `true` 일 경우, scan flag (`scan->rs_base.rs_flags`) 의 access strategy 를 bulkread (`BAS_BULKREAD`) 로 설정한다.
- [L362-L391](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L362-L391): `allow_sync` 와 (추가적인 몇가지 정보... #draft ) 들을 이용하여 scan flag (`scan->rs_base.rs_flags`) 의 syncscan 을 설정한다.
- [L393-L405](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L362-L391): [[struct TableScanDesc (Postgres Coderef)|TableScanDesc]] 의 몇가지 field 들을 default 값들로 설정한다.
- [L409-L413](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L409-L413): Scan key 가 valid 하다면, 복사한다.
- [L415-L421](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L415-L421): Statistics 를 설정한다.