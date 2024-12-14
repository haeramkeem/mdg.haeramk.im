---
tags:
  - database
  - db-postgresql
aliases:
  - ReadStream
  - struct ReadStream
  - Read Stream Mode
date: 2024-12-14
---
> [!info]- 코드 위치 (v17.1)
> - File path: `src/backend/storage/aio/read_stream.c`
> - Line: `109`
> - Link: #draft 
> - VIM
> ```
> vi src/backend/storage/aio/read_stream.c +109
> ```

## Read Stream Mode

- *Read stream mode* 매번 buffer 를 하나씩 읽어들이는 것이 아닌, access pattern 을 지정해주면 그것에 따라 buffer 들을 prefetch 해주는 read mode 이다.
- 그리고 이에 대한 context 를 제공해주는 자료구조가 `struct ReadStream` 이다.
- 여기서 access pattern 은 직접 지정해줄 수도 있고 (`callback`), sequential scan 을 자동으로 detect 하기도 한다.
- 한번에 몇개나 읽어들일지 (`distance`) 에 대해서는 다음의 상황에 따라 adaptive 하게 지정된다:
	- (A) 만약에 이전에 요청한 것들이 이미 buffer 로 모두 올라왔다면, 하나만 읽어들인다.
	- (B) 만약에 이전에 요청한 것들이 buffer 로 올라오는 중이고 [[Advice (OS)|fadvice]] 는 사용하지 못한다면, 읽어들이는 개수를 2배 증가시킨다. 다만, 이때는 설정값 (`io_combine_limit`) 보다 커질 수는 없다.
	- (C) 만약에 이전에 요청한 것들이 buffer 로 올라오는 중이고 fadvice 도 사용할 수 있다면, 이때도 2배 증가시키되 설정값 (`io_combine_limit`) 보다도 커질 수 있다.
- 즉, 위와 같은 전략으로 읽어들이는 개수가 늘어날때는 크게, 줄어드는 것은 서서히 줄어들게 할 수 있다.
	- 왜냐면 만약에 buffer 에 올라온 block 이 적을 때에는 많이 가져오도록 하고, 이미 많이 올라와 있다면 적게만 가져오게 해서 이 read stream 이 너무 많은 buffer 를 차지하지 않게 하기 위함이다.

## `struct ReadStream` Fields

- 일단 아래의 그림과 같이 크게는 두개의 circular queue 로 구성된다.
	- 여기서 `buf/data` 는 buffer manager 의 에 있는 진짜 buffer 공간을 나타내는 것이다. 즉, `ReadStream` 에 대한 내용은 아니라는 것.

```c
/**
 * For example, if the callback returns block numbers 10, 42, 43, 44, 60 in
 * successive calls, then these data structures might appear as follows:
 *
 *                          buffers buf/data       ios
 *
 *                          +----+  +-----+       +--------+
 *                          |    |  |     |  +----+ 42..44 | <- oldest_io_index
 *                          +----+  +-----+  |    +--------+
 *   oldest_buffer_index -> | 10 |  |  ?  |  | +--+ 60..60 |
 *                          +----+  +-----+  | |  +--------+
 *                          | 42 |  |  ?  |<-+ |  |        | <- next_io_index
 *                          +----+  +-----+    |  +--------+
 *                          | 43 |  |  ?  |    |  |        |
 *                          +----+  +-----+    |  +--------+
 *                          | 44 |  |  ?  |    |  |        |
 *                          +----+  +-----+    |  +--------+
 *                          | 60 |  |  ?  |<---+
 *                          +----+  +-----+
 *     next_buffer_index -> |    |  |     |
 *                          +----+  +-----+
 *
 * In the example, 5 buffers are pinned, and the next buffer to be streamed to
 * the client is block 10.  Block 10 was a hit and has no associated I/O, but
 * the range 42..44 requires an I/O wait before its buffers are returned, as
 * does block 60.
 */
```

- `buffers`: Prefetch 되어서 가져오고 있거나, 아니면 이미 가져온 block 들을 저장하는 놈이다. 이때,
	- `oldest_buffer_index`: Circular queue head 이다.
	- `next_buffer_index`: Circular queue tail 이다.
	- `max_pinned_buffers`: Prefetch 가 완료되었거나, 아니면 진행중인 buffer 는 pinning 된다. 이때, 최대 몇개까지 pinning 할 수 있는지에 대한 정보이다.
		- 즉, 최대로 prefetch 완료 혹은 진행중일 수 있는 buffer 의 개수이다.
	- `pinned_buffers`: 현재 pinning 된 buffer 의 개수이다.
		- 즉, 현재 prefetch 완료 혹은 진행중일 수 있는 buffer 의 개수이자
		- 현재의 `buffer` queue 의 size 이다.
- `ios`: 해당 prefetch 를 담당하는 IO worker 들을 저장하는 놈이다. 이때,
	- `oldest_io_index`: Circular queue head 이다.
	- `next_io_index`: Circular queue tail 이다.
	- `max_ios`: 최대로 운용할 수 있는 IO worker 의 개수이다.
	- `ios_in_progress`: 현재 운용되고 있는 IO worker 의 개수이다.
		- 즉, 현재의 `ios` queue 의 size 이다.
- `distance`: 한번에 몇개나 갖고올 것이냐.
- `advice_enabled`: fadvice 를 사용할 수 있냐에 대한 여부.
- `callback`, `callback_private_data`: Access pattern 에 대한 정보를 제공하는 field 이다.
	- 여기서 `callback` 은 [[Function Pointer (C Type)|Function pointer]] 로, 매번 이 함수를 호출해 다음에 접근할 bloick number 를 받아온다.
- `seq_blocknum`: Sequential scan 인지 detect 하기 위해 이전 (혹은 이후) 에 접근한 block number 를 저장하는 곳이다.
- `pending_read_blocknum`: 현재 IO 진행중인 block 번호.
	- 아마 scan direction 에 따라 한방향으로만 prefetch 되기 때문에, 가장 작은 (작은 번호에서 큰 수로의 방향일 경우) 값이 담기지 않나 싶다.
- `pending_read_nblocks`: 현재 IO 진행중인 block 의 개수.
- `per_buffer_data_size`: Queue head (`oldest_buffer_index`) 의 buffer data 의 크기
- `per_buffer_data`: Queue head (`oldest_buffer_index`) 의 buffer data 를 가리키는 포인터
- `fast_path`: 위에서 말한 (A) 시나리오인가에 대한 flag.
	- 즉, 모든 buffer 가 prefetch 되었으면 이 flag 가 켜지게 된다.
