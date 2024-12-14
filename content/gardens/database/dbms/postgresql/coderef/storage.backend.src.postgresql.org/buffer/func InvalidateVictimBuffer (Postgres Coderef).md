---
tags:
  - database
  - db-postgresql
date: 2024-11-05
aliases:
  - InvalidateVictimBuffer
  - InvalidateVictimBuffer()
---
> [!info]- 코드 위치 (v16.4)
> - File path
> ```
> src/backend/storage/buffer/bufmgr.c
> ```
> - Line: `1517`
> - Link: [InvalidateVictimBuffer()](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/bufmgr.c#L1507-L1582)

## Overview

- 요청된 buffer 를 깨끗하게 정리해 재활용할 수 있게 해주는 함수이다.

## Line ref

- [L1526-L1532](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/bufmgr.c#L1526-L1532): Buffer table 에서 buffer 를 지울 것이기에, buffer table 의 entry (즉, hashtable entry) 에 대한 lock 을 잡는다.
- [L1534-L1535](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/bufmgr.c#L1534-L1535): Buffer descriptor 를 수정할 것이기에, buffer 자체에 대해서도 lock 을 잡는다.
	- 변수명이 `buf_hdr` 로 되어 있어서 헷갈릴 수 있는데, buffer header 가 buffer descriptor 를 의미하는 것이라 생각해도 된다.
- [L1537-L1543](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/bufmgr.c#L1537-L1543): Buffer 가 의도한 상태인지 체크
- [L1545-L1557](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/bufmgr.c#L1545-L1557): 찰나의 순간에 buffer 가 concurrent 하게 ref count 가 올라갔거나 dirty 가 되었을 수 있다. 이때는 `false` 를 반환하며 함수를 종료해 작업을 취소한다.
- [L1559-L1570](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/bufmgr.c#L1559-L1570): Buffer descriptor 를 깨끗하게 초기화 해주고 buffer lock 을 풀어준다.
- [L1572-L1575](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/bufmgr.c#L1572-L1575): Buffer table 에서 buffer 를 지워주고 buffer table lock 을 풀어준다.
- [L1577-L1581](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/bufmgr.c#L1577-L1581): 마지막으로 상태 체크를 해준 뒤에 종료.

## Caller

- 이놈은 다음의 함수에서 호출된다:
	- [[func GetVictimBuffer (Postgres Coderef)|GetVictimBuffer]]