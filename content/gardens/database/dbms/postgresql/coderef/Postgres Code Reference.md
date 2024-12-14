---
tags:
  - database
  - db-postgresql
date: 2024-11-21
---
## `src/backend/storage/aio`

- Types
	- [[struct ReadStream (Postgres Coderef)|ReadStream]]

## `src/backend/storage/buffer`

- Types
	- [[type Buffer (Postgres Coderef)|Buffer]]
	- [[type BufferDesc (Postgres Coderef)|BufferDesc]]
	- [[type BufferStrategyControl (Postgres Coderef)|BufferStrategyControl]]
- Funcs
	- [[func ClockSweepTick (Postgres Coderef)|ClockSweepTick]]
	- [[func GetVictimBuffer (Postgres Coderef)|GetVictimBuffer]]
	- [[func InvalidateVictimBuffer (Postgres Coderef)|InvalidateVictimBuffer]]
	- [[func StrategyGetBuffer (Postgres Coderef)|StrategyGetBuffer]]

## `src/backend/access/heap`

- Funcs
	- [[func heap_fetch_next_buffer (Postgres Coderef)|heap_fetch_next_buffer]]

## `src/backend/postmaster`

- Funcs
	- [[func BackendStartup (Postgres Coderef)|BackendStartup]]