---
tags:
  - database
  - db-postgresql
  - draft
aliases:
  - StartReadBufferImpl
  - StartReadBufferImpl()
  - StartReadBuffer
  - StartReadBuffer()
  - StartReadBuffers
  - StartReadBuffers()
---
> [!info]- `StartReadBuffer` 와 `StartReadBuffers` 은 여기로 redirect 됩니다.
> - 왜냐면 `StartReadBuffer` 와 `StartReadBuffers` 에서는 argument 를 설정하고 `StartReadBufferImpl` 을 호출하는게 전부이기 때문.
> - `StartReadBuffer` 의 코드 위치 (v17.1):
> 	- File path: `src/backend/storage/buffer/bufmgr.c`
> 	- Line: `1367`
> 	- Link: [StartReadBuffer()](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/buffer/bufmgr.c#L1361-L1379)
> - VIM
> ```
> vi src/backend/storage/buffer/bufmgr.c +1367
> ```
> - `StartReadBuffers` 의 코드 위치 (v17.1):
> 	- File path: `src/backend/storage/buffer/bufmgr.c`
> 	- Line: `1352`
> 	- Link: [StartReadBuffers()](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/buffer/bufmgr.c#L1333-L1359)
> - VIM
> ```
> vi src/backend/storage/buffer/bufmgr.c +1352
> ```

> [!fail]- 본 글은 #draft 상태입니다.
> - [ ] 내용 정리

