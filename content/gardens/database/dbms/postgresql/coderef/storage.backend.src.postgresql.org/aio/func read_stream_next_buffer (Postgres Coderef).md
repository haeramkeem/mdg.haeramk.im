---
tags:
  - database
  - db-postgresql
  - draft
aliases:
  - read_stream_next_buffer
  - read_stream_next_buffer()
---
> [!info]- 코드 위치 (v17.1)
> - File path: `src/backend/storage/aio/read_stream.c`
> - Line: `540`
> - Link: [read_stream_next_buffer()](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L530-L732)
> - VIM
> ```
> vi src/backend/storage/aio/read_stream.c +540
> ```

## Overview

- [[struct ReadStream (Postgres Coderef)|Read Stream Mode]] 로 다음 buffer 를 읽는 것을 총괄하는 함수이다.
- [[struct ReadStream (Postgres Coderef)|여기]] 에서 말한 것처럼, (A) 모든 prefetch 가 완료되어 buffer 로 전부 올라온 경우 (B) prefetch 가 진행중이고 [[C - File IO syscall (open, write, read, fsync, close)|fsync]] 를 사용할 수 없는 경우, (C) prefetch 가 진행중이고 [[C - File IO syscall (open, write, read, fsync, close)|fsync]] 를 사용할 수 있는 경우 세가지로 나뉜다.
	- Read stream mode 에서의 작동방식은 [[struct ReadStream (Postgres Coderef)|여기]] 에 설명해놓았으니 앞으로의 내용을 이해하기 위해서는 이 내용을 알고 있어야 한다.

## Line Ref

- [L547-L609](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L547-L609): (A) 상황이라면, `stream->fast_path` flag 가 켜져있다. 따라서 이 부분에서 (A) 상황을 처리한다.
	- [L557-L562](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L557-L562): (A) 상황이라면 만족해야 하는 조건들을 검사한다.
		- [L558](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L558): 당연히 진행중인 IO 는 없어야 한다.
		- [L559](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L559): prefetch 진행중인 buffer 가 없기 때문에, `stream->buffers` circular queue 의 head 만 pinning 되어 있다. 따라서 pin count 는 1이어야 한다.
		- [L560](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L560): (A) 상황에서는 `stream->distance` 는 1이다.
		- [L561](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L561): prefetch 진행중인 buffer 가 없기 때문에, pending read count 도 당연히 1이다.
		- [L562](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L562): #draft 이건 모르겠네
	- [L564-L569](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L564-L569): `stream->buffers` circular queue 의 head (`stream->oldest_buffer_index`) 를 return 하기 위해, 이에 대한 정보를 local variable (`oldest_buffer_index`, `buffer`) 들로 읽어온다.
	- [L571-L572](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L571-L572): [[gardens/database/dbms/postgresql/coderef/storage.backend.src.postgresql.org/aio/func read_stream_get_block (Postgres Coderef)|read_stream_get_block()]] 를 호출해 다음으로 prefetch 할 block 을 알아온다.
		- 이것을 하는 이유는 (A) 상황에서는 `stream->distance` 가 1이기 때문에, 하나만을 읽어오면 된다. 따라서 여기에서 prefetch 를 바로 시작하려는 속셈인 것.
		- 이건 (B) 와 (C) 의 작동과는 차이가 있다. (B) 와 (C) 에서는 여러 block 을 prefetch 해야 하기 때문에, [[func read_stream_look_ahead (Postgres Coderef)|read_stream_look_ahead()]] 를 호출하는 것으로 prefetch 작업을 위임한다.
	- [L574-L598](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L574-L598): 만약 다음으로 prefetch 할 block 이 valid 하다면, 이놈을 prefetch 해온다.
		- [L576-L590](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L576-L590): [[func StartReadBuffersImpl (Postgres Coderef)|StartReadBuffer()]] 로 buffer 를 읽어온다.
			- 만약 이 함수의 return 값이 `false` 라면, IO 를 기다릴 필요가 없다는 것이다. 따라서 이때는 `buffer` 를 바로 return 하여 다음에 본 함수가 호출되었을때도 IO 를 기다리지 않게 한다.
		- [L592-L597](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L592-L597): 다음에 본 함수를 call 했을 때 IO 를 wait 할 수 있게 하기 위해 `stream` 의 값들을 조정해준다.
	- [L599-L605](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L599-L605): 만약 다음으로 prefetch 할 block 이 invalid 하다면, 더 이상 block 이 없다는 것이므로 (즉, relation 을 모두 scan 했다는 뜻이므로) 모두 초기화해준다.
	- [L607-L608](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L607-L608): 하나를 prefetch 하도록 요청했기 때문에 더이상 (A) 상황이 아니다. 따라서 `stream->fast_path` flag 를 끄고 buffer 를 return 한다.
- [L612-L634](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L612-L634): `stream->pinned_buffers == 0` 라면, prefetch 가 진행중이거나 완료된 놈이 아무것도 없다는 것이다. 따라서 이 부분에서 prefetch 를 "개시"한다.
	- "개시" 라고 적은 이유는 "처음으로 시작" 하기 때문.
	- [L614-L618](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L614-L618): 우선 stream 이 끝까지 왔나를 확인한다. 끝까지 왔다면, invalid buffer 를 return 한다.
	- [L620-L626](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L620-L626): [[func read_stream_look_ahead (Postgres Coderef)|read_stream_look_ahead()]] 로 prefetch 를 시작한다.
	- [L628-L633](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L628-L633): 다시 한번 stream 이 끝까지 왔나를 확인한다. 끝까지 왔다면, invalid buffer 를 return 한다.
- [L636-L645](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L636-L645): `stream->buffers` circular queue 의 head (`stream->oldest_buffer_index`) 를 return 하기 위해, 이에 대한 정보를 local variable 들로 읽어온다.
- [L647-L687](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L647-L687): `stream->buffers` circular queue 의 head (`stream->oldest_buffer_index`) 가 현재 IO 진행중인지 체크하고, 진행중이라면 대기한다.
	- [L651-L658](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L651-L658): [[func WaitReadBuffers (Postgres Coderef)|WaitReadBuffers()]] 를 호출해 `stream->buffers` circular queue 의 head (`stream->oldest_buffer_index`) 에 대한 IO 가 끝날때까지 대기한다.
	- [L660-L661](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L660-L661): `stream->buffers` circular queue 의 head (`stream->oldest_buffer_index`) 에 대한 IO 가 끝났으므로 진행중인 IO () 를 감소시킨다.
	- [L662-L663](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L662-L663): 만약 `stream->ios` circular queue 의 head 가 wraparound 가 필요하다면, 0으로 조정해준다.
	- [L665-L671](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L665-L671): fadvice 를 사용할 수 있는 (C) 상황이라면, 그에 맞게 `stream->distance` 를 두배 해주되 `stream->max_pinned_buffers` 는 넘어가지 못하게 해준다.
	- [L672-L685](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L672-L685): fadvice 를 사용할 수 없는 (B) 상황이라면, 그에 맞게 `stream->distance` 를 조정해준다.
		- `stream->distance` 가 `io_combine_limit` 보다 크다면 1 감소하고,
		- 그렇지 않다면 `stream->distance` 를 2배해주되 `io_combine_limit` 는 넘어가지 않게 해준다.
- [L707-L717](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L707-L717): `stream->buffers` circular queue 의 head (`stream->oldest_buffer_index`) 의 buffer 를 return 해주기 위해 이놈을 circular queue 에서 빼낸다.
	- [L707-L709](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L707-L709): Read stream 에서 해당 buffer 를 관리하지 않기 때문에, `stream->pinned_buffers` 를 감소시킨다.
	- [L711-L714](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L711-L714): `stream->oldest_buffer_index` 를 옮겨서 circular queue 에서 빼준다. 또한 만약에 wraparound 가 필요하다면 0으로 조정해준다.
	- [L716-L717](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L716-L717): Read stream 에서 buffer 가 하나 빠졌으므로 [[func read_stream_look_ahead (Postgres Coderef)|read_stream_look_ahead()]] 를 호출해 추가적인 buffer 를 prefetch 해온다.
- [L720-L728](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L720-L728): 만약 이 시점에 (A) 상황을 만족한다면, `stream->fast_path` 를 켜준다.
- [L731](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/storage/aio/read_stream.c#L731): `stream->buffers` circular queue 의 head (`stream->oldest_buffer_index`) "였던 놈" 을 return 한다.