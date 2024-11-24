---
tags:
  - database
  - db-postgresql
date: 2024-11-05
aliases:
  - GetVictimBuffer
---
> [!info] 코드 위치
> - File path
> ```
> src/backend/storage/buffer/bufmgr.c
> ```
> - Line: `1585`
> - Link: [GetVictimBuffer()](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/bufmgr.c#L1584-L1736)

## Overview

- 얘는 바로 사용할 수 있는 clean 한 상태의 buffer 를 반환한다.
- 따라서 전체적으로는 [[func StrategyGetBuffer (Postgres Coderef)|StrategyGetBuffer]] 로 buffer 를 하나 골라서 [[func InvalidateVictimBuffer (Postgres Coderef)|InvalidateVictimBuffer]] 로 정리해서 주는 작업을 한다.

## Line ref

- [L1602-L1607](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/bufmgr.c#L1602-L1607): [[func StrategyGetBuffer (Postgres Coderef)|StrategyGetBuffer]] 로 free 혹은 victim buffer 를 하나 가져온다.
- [L1609-L1617](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/bufmgr.c#L1609-L1617): Buffer 가 의도한 상태인지 확인한다.
	- `1609`: Reference count ([[type BufferDesc (Postgres Coderef)|BufferDesc]] 의) 는 본인 하나만 접근하고 있기 때문에 반드시 1이어야 한다.
	- `1612`: [[func StrategyGetBuffer (Postgres Coderef)|StrategyGetBuffer]] 는 buffer 에 대한 spinlock 를 잡은 상태에서 반환한다. 따라서 여기서 pin count 를 올리고 lock 을 푼다.
		- 이것은 아마 pin count 가 0인 찰나의 순간에 다른 누군가가 evict 시켜버릴 수 있기 때문인듯
	- `1617`: 본인이 pinning 한 것 이외에는 다른 누군가가 pinning 하지 않아야 한다.
- [L1619-L1689](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/bufmgr.c#L1619-L1689): Buffer 가 dirty 인지 확인하고 맞다면 flush 를 한다.
	- `1633-1656`: 이 buffer 를 flush 하기 전에 shared lock 을 잡는다.
		- 이걸 하는 이유는 flush 를 하는 와중에 write 가 될 수 있기 때문.
			- 따라서 write 를 막아야 하기 때문에 shared lock 만 잡는다.
		- 또한, 이 lock 을 잡는데 실패하면 기다리지 않고 다시 처음 (`1602` 줄) 으로 돌아간다.
			- 여기서 기다리지 않는 것은 deadlock 을 막기 위해서이다.
			- 두 backend 가 하나의 [[B+ Tree (Database Index)|B+ Tree]] page 를 split 하려고 할 때 이런 일이 발생할 수 있다고 한다.
	- `1658-1681`: WAL 은 말 그대로 Write-ahead 이기 때문에, buffer 가 flush 되기 전에 WAL 이 먼저 flush 되어야 한다. 따라서 이 부분에서 아직 WAL 이 flush 되지 않았다면 해당 buffer 는 기각하고 다시 처음 (`1602` 줄) 로 돌아간다.
		- 다만 Write-ahead 가 반드시 지켜지는 것은 아닌 것 같다.
		- Default strategy 가 아닐때 이것을 체크하는 것으로 봐서, default strategy 일 때는 WAL 보다 data 가 먼저 flush 될 수 있는듯.
	- `1683-1688`: [[func PostgresMain (Postgres Coderef)|FlushBuffer]] 함수로 실질적으로 flush 를 수행하는 곳이다.
- [L1692-L1712](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/bufmgr.c#L1692-L1712): Statistics 작업해주는거같은데 뭔지는 잘 모르겠음
- [L1714-L1723](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/bufmgr.c#L1714-L1723): [[func InvalidateVictimBuffer (Postgres Coderef)|InvalidateVictimBuffer]] 로 buffer 를 buffer table 에서 삭제하는 등의 buffer 를 clean 한 상태로 바꿔준다.
	- 만약 근데 찰나의 순간에 다른 누군가가 pinning 했거나 write 했을 수 있기 때문에, 만약 이 함수가 실패하면 다시 처음 (`1602` 줄) 으로 돌아간다.
- [L1726-L1735](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/storage/buffer/bufmgr.c#L1726-L1735): Return 전에 마지막으로 한번 더 의도한 상태인지 체크하고 return 한다.

## Caller

- 이놈은 다음의 함수에서 호출된다:
	- [[func BufferAlloc (Postgres Coderef)|BufferAlloc]]
	- [[func ExtendBufferedRelShared (Postgres Coderef)|ExtendBufferedRelShared]]