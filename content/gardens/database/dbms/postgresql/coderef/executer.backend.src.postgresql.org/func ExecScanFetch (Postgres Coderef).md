---
tags:
  - database
  - db-postgresql
aliases:
  - ExecScanFetch
  - ExecScanFetch()
date: 2024-12-14
---
> [!info]- 코드 위치 (v17.1)
> - File path: `src/backend/executor/execScan.c`
> - Line: `34`
> - Link: [ExecScanFetch()](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/execScan.c#L26-L132)
> - VIM
> ```
> vi src/backend/executor/execScan.c +34
> ```

## Overview

- 주어진 recheck method 혹은 access method 을 호출해 slot 을 가져온다.

## Line Ref

- [L38-L126](https://github.com/postgres/postgres/blob/master/src/backend/executor/execScan.c#L38-L126): #draft 상황에 따라 적절히 recheck method 를 호출해 slot 을 받아온다.
- [L128-L131](https://github.com/postgres/postgres/blob/master/src/backend/executor/execScan.c#L128-L131): Recheck 를 하는 상황이 아니라면, access method 를 호출해 slot 을 받아온다.
	- 만약 [[func ExecSeqScan (Postgres Coderef)|ExecSeqScan()]] 으로 본 함수가 호출된 경우라면, 여기서 [[func SeqNext (Postgres Coderef)|SeqNext()]] 가 호출된다.