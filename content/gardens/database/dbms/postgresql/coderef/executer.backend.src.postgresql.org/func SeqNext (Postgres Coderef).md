---
tags:
  - database
  - db-postgresql
aliases:
  - SeqNext
  - SeqNext()
date: 2024-12-14
---
> [!info]- 코드 위치 (v17.1)
> - File path: `src/backend/executor/nodeSeqscan.c`
> - Line: `50`
> - Link: [SeqNext()](https://github.com/postgres/postgres/blob/master/src/backend/executor/nodeSeqscan.c#L43-L83)
> - VIM
> ```
> vi src/backend/executor/nodeSeqscan.c +50
> ```

## Overview

- [[func ExecSeqScan (Postgres Coderef)|ExecSeqScan]] 의 실질적인 시작점으로, table scan 으로 slot 을 받아온다.

## Line Ref

- [L52-L63](https://github.com/postgres/postgres/blob/master/src/backend/executor/nodeSeqscan.c#L52-L63): Query plan node ([[struct SeqScanState (Postgres Coderef)|SeqScanState]]) 로부터 scan context ([[struct TableScanDesc (Postgres Coderef)|TableScanDesc]]) 및 expression context ([[struct EState (Postgres Coderef)|EState]]) 를 받아온다.
- [L65-L75](https://github.com/postgres/postgres/blob/master/src/backend/executor/nodeSeqscan.c#L65-L75): 만약 scan context 가 `NULL` 이라면, [[func table_beginscan (Postgres Coderef)|table_beginscan]] 을 호출하여 scan context 를 init 한다.
- [L77-L82](https://github.com/postgres/postgres/blob/master/src/backend/executor/nodeSeqscan.c#L77-L82): [[func table_scan_getnextslot (Postgres Coderef)|table_scan_getnextslot]] 를 호출해 table scan 으로 slot 하나를 받아온 후, valid 하다면 그것을 반환하되 그렇지 않다면 `NULL` 을 반환한다.