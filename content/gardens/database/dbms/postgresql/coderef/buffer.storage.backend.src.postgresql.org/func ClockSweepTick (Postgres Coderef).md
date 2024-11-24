---
tags:
  - database
  - db-postgresql
date: 2024-11-05
aliases:
  - ClockSweepTick
---
> [!info] 코드 위치
> - File path
> ```
> src/backend/storage/buffer/freelist.c
> ```
> - Line: `107`
> - Link: [ClockSweepTick()](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/freelist.c#L101-L164)

## Overview

- 이놈은 CLOCK ticking 을 하는 함수이다.
	- 사실 이게 다다. 그냥 clock hand 를 하나 움직이고 (추가적으로 wraparound 를 위한 작업을 좀 해준 뒤) clock hand 를 반환한다.

## Line ref

- [L112-L118](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/freelist.c#L112-L118): CLOCK hand ([[type BufferStrategyControl (Postgres Coderef)|BufferStrategyControl]] 의 `nextVictimBuffer`) 를 1 증가시킨다.
	- 따라서 위 소스코드를 보면 `pg_atomic_fetch_add_u32` 으로 CLOCK hand 를 atomic 하게 가져오고 1을 증가시키는 것을 알 수 있다.
- [L120-L125](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/freelist.c#L120-L125): 다만 CLOCK 이기 때문에, hand 는 항상 buffer 의 총 개수보다 작아 circular 하게 작동하도록 해야 한다.
	- 따라서 위 코드에서 modular 연산으로 범위 내에 들어오도록 해주는 것을 알 수 있다.
- [L127-L161](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/freelist.c#L127-L161): 또한 이제 막 wraparound (즉, 한바퀴를 돌아 다시 원점으로 돌아온 경우) 되었을 때, `pg_atomic_compare_exchange_u32` 으로 atomic 하게 `nextVictimBuffer` 를 wraparound 된 값으로 설정해주는 것을 알 수 있다.

## Caller

- 이놈은 다음의 함수에서 호출된다:
	- [[func StrategyGetBuffer (Postgres Coderef)|StrategyGetBuffer]]