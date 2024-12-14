---
tags:
  - database
  - db-postgresql
aliases:
  - read_stream_next_buffer
  - read_stream_next_buffer()
---
> [!fail]- 본 글은 #draft 상태입니다.
> - [ ] 내용 정리

> [!info]- 코드 위치 (v17.1)
> - File path: `src/backend/storage/aio/read_stream.c`
> - Line: `540`
> - Link: #draft 
> - VIM
> ```
> vi src/backend/storage/aio/read_stream.c +540
> ```

- 매번 하나의 buffer 를 읽어들이는 것이 아닌, access pattern 을 지정해주면 그것에 따라 buffer 들을 prefetch 해주는 read mode 이다.
- StartReadBuffers 로 read 를 async 하게 시작하고, WaitReadBuffers 로 이것이 종료되었는지를 기다린다.
- 원하는 access pattern 은 callback 으로 지정한다.
- read distance 는 몇개나 읽어들일지 인데, 이것은 다음의 상황에 따라 adaptive 하게 지정된다:
	- (A) 만약에 이전에 요청한 것들이 이미 buffer 로 모두 올라왔다면, 하나만 읽어들인다. 따라서 distance 는 1이다.
	- (B) 만약에 IO 가 필요한데 advice 는 사용하지 못한다면, io_combine_limit 까지만 읽어들이다.
	- (C) 만약에 IO 가 필요하고 advice 도 사용할 수 있다면, io_combine_limit 보다 많은 개수를 읽어들인다.
- 이것은 distance 가 늘어날때는 한번에 늘어나고, 줄어드는 것은 서서히 줄어들게 한다.

- L547-L609
- L612-L634
- L636-L645
- L647-L687
- L707-L717
- L720-L728
- L731