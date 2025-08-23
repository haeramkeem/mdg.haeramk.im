---
tags:
  - database
  - db-postgresql
aliases:
  - ExecScan
  - ExecScan()
date: 2024-12-15
---
> [!info]- 코드 위치 (v17.1)
> - File path: `src/backend/executor/execScan.c`
> - Line: `156`
> - Link: [ExecScan()](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/execScan.c#L134-L254)
> - VIM
> ```
> vi src/backend/executor/execScan.c +156
> ```

## Overview

- Slot 하나를 읽어온 후, qualification condition 과 projection 을 처리해 반환한다.

## Line Ref

- [L160-L169](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/execScan.c#L160-L169): Qualification condition 혹은 projection 등에 대한 expression 정보를 query plan tree node ([[struct SeqScanState (Postgres Coderef)|SeqScanState]]) 에서 가져온다.
- [L173-L181](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/execScan.c#L173-L181): Qualification condition 와 projection 이 모두 없다면, `#define ResetExprContext()` macro 를 호출해 이전의 context data 를 전부 지운 후 [[func ExecScanFetch (Postgres Coderef)|ExecScanFetch]] 을 호출해 다음 [[Slotted Page (Database Format)|Slot]] 을 받아 반환한다.
- [L183-L254](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/execScan.c#L183-L254): Slot 을 하나 받아 qualification condition 과 projection 을 처리한다.
	- [L183-L187](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/execScan.c#L183-L187): 마찬가지로 `#define ResetExprContext()` macro 를 호출해 이전의 context data 를 전부 지운다.
	- [L189-L253](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/execScan.c#L189-L253): Slot 을 받은 뒤 qualification condition 과 projection 을 처리하는 `for` loop 이다.
		- [L195-L197](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/execScan.c#L195-L197): [[func ExecScanFetch (Postgres Coderef)|ExecScanFetch]] 를 호출해 slot 을 받는다.
		- [L199-L211](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/execScan.c#L199-L211): 받은 slot 이 `NULL` 이라면, 이때는 더 이상 slot 이 없다는 소리이다.
		- [L213-L216](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/execScan.c#L213-L216): Context 에 slot 정보를 추가한다.
		- [L218-L245](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/execScan.c#L218-L245): Qualification condition 을 검사한 후, 부합한다면 아래의 과정을 거친다.
			- [L227-L237](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/execScan.c#L227-L237): Projection 이 필요하다면, [[func ExecProject (Postgres Coderef)|ExecProject]] 을 호출해 projection 을 처리한다.
			- [L238-L244](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/execScan.c#L238-L244): Projection 이 필요 없다면 바로 slot 을 반환한다.
		- [L246-L252](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/execScan.c#L246-L252): Qualification condition 이 부합하지 않는다면, 다시 context data 를 비워준 후 `for` loop 으로 다시 처음으로 돌아갈 수 있게 한다.