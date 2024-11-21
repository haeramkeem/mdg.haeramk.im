---
tags:
  - database
  - db-postgresql
date: 2024-11-05
aliases:
  - InvalidateVictimBuffer
---
> [!fail]- 본 글은 #draft 상태입니다.
> - [ ] 내용 정리

> [!info] 코드 위치
> - File path
> ```
> src/backend/storage/buffer/bufmgr.c
> ```
> - Line: `1517`
> - Link: [InvalidateVictimBuffer()](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/bufmgr.c#L1507-L1582)

## `InvalidateVictimBuffer()`