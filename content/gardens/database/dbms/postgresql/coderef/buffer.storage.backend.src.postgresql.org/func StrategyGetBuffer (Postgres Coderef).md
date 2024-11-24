---
tags:
  - database
  - db-postgresql
date: 2024-11-05
aliases:
  - StrategyGetBuffer
---
> [!info] 코드 위치
> - File path
> ```
> src/backend/storage/buffer/freelist.c
> ```
> - Line: `196`
> - Link: [StrategyGetBuffer()](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/freelist.c#L183-L357)

## Overview

- 여기가 실질적으로 CLOCK 을 돌리는 함수이다.
	- 여기서는 크게 (1) freelist 를 뒤져서 free buffer 가 있으면 주거나 (2) free buffer 가 없으면 CLOCK 을 돌리는 순서로 작동한다.

## Line ref

- [L205-L250](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/freelist.c#L205-L250): 여기서는 [[Ring Buffer (PostgreSQL)|ring buffer]] 나 [[Background Writer (PostgreSQL)|bgwriter]] 를 위한 작업을 수행한다. 일단은 패스...
- [L252-L312](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/freelist.c#L252-L312): 여기서 freelist 를 뒤진다.
	- 일단 [[type BufferStrategyControl (Postgres Coderef)|BufferStrategyControl]] 의 `firstFreeBuffer` 를 보고 0 보다 크면 free buffer 가 있다는 것이므로 해당 free buffer 를 가져온다.
	- 가져올때는 `firstFreeBuffer` 를 가져온 놈이 가리키는놈 (즉, [[type BufferDesc (Postgres Coderef)|BufferDesc]] 의 `freeNext`) 으로 설정해 head 를 빼오고,
	- 가져온 놈은 `freeNext` 를 `FREENEXT_NOT_IN_LIST` (즉, `-2`) 로 설정한다.
- [L314-L356](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/freelist.c#L314-L356): 여기서는 free buffer 가 없으므로 CLOCK 을 돌린다.
	- 이때는 CLOCK 을 한바퀴 돌릴거다. 즉, `trycounter` 를 buffer 개수로 설정해 한바퀴가 돌아가도록 한다.
	- (a) 일단 [[func ClockSweepTick (Postgres Coderef)|ClockSweepTick]] 으로 CLOCK hand 를 돌려 victim 을 가져온다.
	- (b) 다음으로 ([[type BufferDesc (Postgres Coderef)|BufferDesc]] 의) `state` 로 조건을 따져본다.
		- 만약 reference count 가 0 보다 크다면, 그냥 `trycounter` 를 하나 줄이고다시 (a) 로 돌아가 CLOCK 한 tick 을 더 움직인다.
			- 이때 만약 `trycounter` 가 0이라면, 이것은 모든 buffer 가 현재 사용중이라는 소리다. 이때는 더 이상 시도하지 않고 실패한 것으로 끝낸다.
			- 물론 여러번 시도할 수 있지만, infinite loop 을 방지하기 위해 실패처리하고 [[Transaction, ACID (Database)|Transaction]] 을 재시작한다고 한다.
		- 만약 그렇지 않다면, 이놈은 현재 사용되고 있지 않다는 얘기다. 이때 usage count 를 확인한다.
			- 만약 usage count 가 0이 아니라면, usage count 를 1 감소시킨다.
				- 여기서 중요한 것은 이 경우에 `trycounter` 를 다시 buffer 개수로 초기화시켜버린다는 것이다.
				- 이말은 reference count 가 0이고, usage count 가 0이 아닌 시점부터 CLOCK 을 한바퀴 돌리는 것으로 생각할 수 있다.
			- Usage count 가 0이라면, 이놈이 방을 빼야할 놈으로 결정된다.

## Caller

- 이놈은 다음의 함수에서 호출된다:
	- [[func GetVictimBuffer (Postgres Coderef)|GetVictimBuffer]]