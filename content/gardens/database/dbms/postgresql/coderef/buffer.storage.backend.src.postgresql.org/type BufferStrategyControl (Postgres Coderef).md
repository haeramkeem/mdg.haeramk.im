---
tags:
  - database
  - db-postgresql
date: 2024-11-05
aliases:
  - BufferStrategyControl
---
> [!info]- 코드 위치 (v16.4)
> - File path
> ```
> src/backend/storage/buffer/freelist.c
> ```
> - Line: `30`
> - Link: [struct BufferStrategyControl](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/freelist.c#L27-L62)

## Overview

- 이놈은 freelist 관리 및 CLOCK 을 돌리기 위한 여러 metadata 가 담기게 된다.

## Fields

- `nextVictimBuffer`: 이놈이 CLOCK hand 이다.
- `firstFreeBuffer`, `lastFreeBuffer`: 이놈들은 freelist 에서 각각 head buffer index, tail buffer index 를 저장한다.