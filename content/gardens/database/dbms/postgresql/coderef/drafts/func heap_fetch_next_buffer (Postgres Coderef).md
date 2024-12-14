---
tags:
  - database
  - db-postgresql
aliases:
  - heap_fetch_next_buffer
  - heap_fetch_next_buffer()
---
> [!fail]- 본 글은 #draft 상태입니다.
> - [ ] 내용 정리

> [!info]- 코드 위치 (v17.1)
> - File path: `src/backend/access/heap/heapam.c`
> - Line: `594`
> - Link: #draft 
> - VIM
> ```
> vi src/backend/access/heap/heapam.c +594
> ```

- Read stream mode 로 다음 buffer 를 갖고오게 함
- L596: Read stream mode 가 맞냐
- L598-L603: current buffer 에 이미 buffer 가 등록되어 있으면 해제함
- L605-L610: interrupt check
- L612-L622: 만약에 scan 방향이 바뀐다면, 지금까지의 read stream 을 전부 취소해서 새로운 read stream 이 시작되게 함
- L626-L628: [[func read_stream_next_buffer (Postgres Coderef)|read_stream_next_buffer()]] 을 호출해 read stream 에서 다음 buffer 를 갖고온다.