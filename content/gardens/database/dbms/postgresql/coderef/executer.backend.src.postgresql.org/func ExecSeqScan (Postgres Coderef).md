---
tags:
  - database
  - db-postgresql
aliases:
  - ExecSeqScan
  - ExecSeqScan()
date: 2024-12-14
---
> [!info]- 코드 위치 (v17.1)
> - File path: `src/backend/executor/nodeSeqscan.c`
> - Line: `108`
> - Link: [ExecSeqScan()](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/executor/nodeSeqscan.c#L98-L115)
> - VIM
> ```
> vi src/backend/executor/nodeSeqscan.c +108
> ```

## Overview

- Sequential scan 을 담당하는 query plan node operator 로, sequential scan 의 첫 시작점이다.

## Line Ref

- [L110-L114](https://github.com/postgres/postgres/blob/master/src/backend/executor/nodeSeqscan.c#L110-L114): 여기서는 [[func SeqNext (Postgres Coderef)|SeqNext]] 를 access method 로, [[func SeqRecheck (Postgres Coderef)|SeqRecheck]] 를 recheck method 로 하여 [[Function Pointer (C Type)|function pointer]] 들을 인자로 [[func ExecScan (Postgres Coderef)|ExecScan]] 를 호출한다.