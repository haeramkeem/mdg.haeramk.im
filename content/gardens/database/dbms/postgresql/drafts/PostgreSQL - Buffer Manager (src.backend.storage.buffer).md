---
tags:
  - database
  - db-postgresql
date: 2024-11-05
title: PostgreSQL - Buffer Manager (/src/backend/storage/buffer)
aliases:
  - bufmgr
---
## Overview

- [[Shared Buffer (PostgreSQL)|여기]] 에서 말한것 처럼, PostgreSQL 에서 shared buffer 는 크게
	1. Buffer entry metadata
	2. Buffer entry 에 대한 (즉, page 데이터가 담기는) 실제 메모리 공간
	3. Buffer 에 어떤 page 가 올라와 있는지를 관리하는 table
- 로 구성되며 이것으로 [[CLOCK (Replacement)|CLOCK]] buffer replacement 를 수행한다.

## Structs

- 이제 사용되는 자료구조부터 하나씩 살펴보자.

### `BufferStrategyControl`

> [!tip] 소스 코드
> - `src/backend/storage/buffer/freelist.c`: [struct BufferStrategyControl](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/freelist.c#L27-L62)

- 이놈은 freelist 관리 및 CLOCK 을 돌리기 위한 여러 metadata 가 담기게 된다.
- 여기에서 몇가지만 보면
	- `nextVictimBuffer`: 이놈이 CLOCK hand 이다.
	- `firstFreeBuffer`, `lastFreeBuffer`: 이놈들은 freelist 에서 각각 head buffer index, tail buffer index 를 저장한다.

### `Buffer`

> [!tip] 소스 코드
> - `src/include/storage/buf.h`: [int Buffer](https://github.com/postgres/postgres/blob/REL_16_4/src/include/storage/buf.h#L17-L23)

- 이건 [[C - Struct|struct]] 가 아니고 단순히 `int` 값인데
- 각 buffer entry 에 대한 index 값이다.
	- 즉, 이 Index 를 가지고 하나의 buffer entry 에 접근할 수 있는 것.
- 사용되는 값은 `1` 부터이다. `0` 은 invalid 임.

### `BufferDesc`

> [!tip] 소스 코드
> - `src/include/storage/buf_internals.h`: [struct BufferDesc](https://github.com/postgres/postgres/blob/REL_16_4/src/include/storage/buf_internals.h#L197-L255)

- 이놈은 하나의 buffer entry 에 대한 metadata 이다.
- Field 들을 몇개만 살펴보자.
	- `tag`: 이것은 해당 buffer 에 있는 page 가 어떤 page 인지를 식별하기 위한 tag 이다.
		- 요약하자면 여기에는 table 의 id (`relNumber`), page id (`blockNum`) 등이 담겨 각 page 를 식별한다.
		- 소스코드: [struct BufferTag](https://github.com/postgres/postgres/blob/REL_16_4/src/include/storage/buf_internals.h#L80-L99)
	- `state`: 이건 여러 정보를 담고 있는 `uint32` 값이다.
		- Buffer 를 관리하기에는 여러가지의 counter 가 필요한데, 이 counter 들에 대해 각각의 변수를 사용하지 않고 (각 counter 들의 값은 그리 크지 않기 때문에) 여기에다가 다 낑가놓는다.
		- 그래서 여기에는 (1) 여러 flag 들, (2) Reference count - 즉, 현재 사용중인 놈이 몇놈인지, (3) Usage count - 즉, 지금까지는 몇놈이 사용됐는지
	- `freeNext`: 위에서 [[#`BufferStrategyControl`|BufferStrategyControl]] 에 freelist 의 head, tail 이 담긴다고 했었는데, 이놈을 통해 다음 free buffer 를 연결해 주어 linked list 가 된다.

## Functions

### `ClockSweepTick()`

> [!tip] 소스 코드
> - `src/backend/storage/buffer/freelist.c`: [ClockSweepTick()](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/freelist.c#L101-L164)

- [L112-L118](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/freelist.c#L112-L118): 이놈은 CLOCK ticking 을 하는 함수이다. 즉, CLOCK hand ([[#`BufferStrategyControl`|BufferStrategyControl]] 의 `nextVictimBuffer`) 를 1 증가시킨다.
	- 따라서 위 소스코드를 보면 `pg_atomic_fetch_add_u32` 으로 CLOCK hand 를 atomic 하게 가져오고 1을 증가시키는 것을 알 수 있다.
- [L120-L125](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/freelist.c#L120-L125): 다만 CLOCK 이기 때문에, hand 는 항상 buffer 의 총 개수보다 작아 circular 하게 작동하도록 해야 한다.
	- 따라서 위 코드에서 modular 연산으로 범위 내에 들어오도록 해주는 것을 알 수 있다.
- [L127-L161](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/freelist.c#L127-L161): 또한 이제 막 wraparound (즉, 한바퀴를 돌아 다시 원점으로 돌아온 경우) 되었을 때, `pg_atomic_compare_exchange_u32` 으로 atomic 하게 `nextVictimBuffer` 를 wraparound 된 값으로 설정해주는 것을 알 수 있다.
- 참고로 이놈은 [[#`StrategyGetBuffer()`|StrategyGetBuffer()]] 에서밖에 호출되지 않는다.

### `StrategyGetBuffer()`

> [!tip] 소스 코드
> - `src/backend/storage/buffer/freelist.c`: [StrategyGetBuffer()](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/freelist.c#L183-L357)

- 여기가 실질적으로 CLOCK 을 돌리는 함수이다.
	- 여기서는 크게 (1) freelist 를 뒤져서 free buffer 가 있으면 주거나 (2) free buffer 가 없으면 CLOCK 을 돌리는 순서로 작동한다.
- [L205-L250](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/freelist.c#L205-L250): 여기서는 [[Ring Buffer (PostgreSQL)|ring buffer]] 나 [[Background Writer (PostgreSQL)|bgwriter]] 를 위한 작업을 수행한다. 일단은 패스...
- [L252-L312](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/freelist.c#L252-L312): 여기서 freelist 를 뒤진다.
	- 일단 [[#`BufferStrategyControl`|BufferStrategyControl]] 의 `firstFreeBuffer` 를 보고 0 보다 크면 free buffer 가 있다는 것이므로 해당 free buffer 를 가져온다.
	- 가져올때는 `firstFreeBuffer` 를 가져온 놈이 가리키는놈 (즉, [[#`BufferDesc`|BufferDesc]] 의 `freeNext`) 으로 설정해 head 를 빼오고,
	- 가져온 놈은 `freeNext` 를 `FREENEXT_NOT_IN_LIST` (즉, `-2`) 로 설정한다.
- [L314-L356](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/freelist.c#L314-L356): 여기서는 free buffer 가 없으므로 CLOCK 을 돌린다.
	- 이때는 CLOCK 을 한바퀴 돌릴거다. 즉, `trycounter` 를 buffer 개수로 설정해 한바퀴가 돌아가도록 한다.
	- (a) 일단 [[#`ClockSweepTick()`|ClockSweepTick()]] 으로 CLOCK hand 를 돌려 victim 을 가져온다.
	- (b) 다음으로 ([[#`BufferDesc`|BufferDesc]] 의) `state` 로 조건을 따져본다.
		- 만약 reference count 가 0 보다 크다면, 그냥 `trycounter` 를 하나 줄이고다시 (a) 로 돌아가 CLOCK 한 tick 을 더 움직인다.
			- 이때 만약 `trycounter` 가 0이라면, 이것은 모든 buffer 가 현재 사용중이라는 소리다. 이때는 더 이상 시도하지 않고 실패한 것으로 끝낸다.
			- 물론 여러번 시도할 수 있지만, infinite loop 을 방지하기 위해 실패처리하고 [[Transaction, ACID (Database)|Transaction]] 을 재시작한다고 한다.
		- 만약 그렇지 않다면, 이놈은 현재 사용되고 있지 않다는 얘기다. 이때 usage count 를 확인한다.
			- 만약 usage count 가 0이 아니라면, usage count 를 1 감소시킨다.
				- 여기서 중요한 것은 이 경우에 `trycounter` 를 다시 buffer 개수로 초기화시켜버린다는 것이다.
				- 이말은 reference count 가 0이고, usage count 가 0이 아닌 시점부터 CLOCK 을 한바퀴 돌리는 것으로 생각할 수 있다.
			- Usage count 가 0이라면, 이놈이 방을 빼야할 놈으로 결정된다.
- 참고로 이놈은 [[#`GetVictimBuffer()`|GetVictimBuffer()]] 에서밖에 호출되지 않는다.

### `GetVictimBuffer()`

> [!tip] 소스 코드
> - `src/backend/storage/buffer/bufmgr.c`: [GetVictimBuffer()](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/bufmgr.c#L1584-L1736)

### `BufferAlloc()`

> [!tip] 소스 코드
> - `src/backend/storage/buffer/bufmgr.c`: [BufferAlloc()](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/bufmgr.c#L1196-L1399)

### `InvalidateVictimBuffer()`

> [!tip] 소스 코드
> - `src/backend/storage/buffer/bufmgr.c`: [InvalidateVictimBuffer()](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/bufmgr.c#L1507-L1582)


