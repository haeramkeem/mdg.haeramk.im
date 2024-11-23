---
tags:
  - database
  - db-postgresql
date: 2024-11-21
---
> [!info] Postgres 버전
> - 코드 분석에 사용된 버전은 [Release 16.4](https://github.com/postgres/postgres/tree/REL_16_4) 입니당

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

## `src/backend/postmaster`

- Funcs
	- [[func BackendStartup (Postgres Coderef)|BackendStartup]]