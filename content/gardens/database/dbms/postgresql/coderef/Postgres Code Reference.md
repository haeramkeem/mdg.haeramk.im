---
tags:
  - database
  - db-postgresql
date: 2024-11-21
---
## `src/backend`

### `access`

- Funcs
	- [[func heap_beginscan (Postgres Coderef)|heap_beginscan]]
	- [[func heap_fetch_next_buffer (Postgres Coderef)|heap_fetch_next_buffer]]
	- [[func initscan (Postgres Coderef)|initscan]]
	- [[func table_beginscan (Postgres Coderef)|table_beginscan]]

### `executor`

- Funcs
	- [[func ExecScan (Postgres Coderef)|ExecScan]]
	- [[func ExecScanFetch (Postgres Coderef)|ExecScanFetch]]
	- [[func ExecSeqScan (Postgres Coderef)|ExecSeqScan]]
	- [[func SeqNext (Postgres Coderef)|SeqNext]]

### `postmaster`

- Funcs
	- [[gardens/database/dbms/postgresql/coderef/postmaster.backend.src.postgresql.org/func BackendStartup (Postgres Coderef)|BackendStartup]]

### `storage`

#### `aio`

- Types
	- [[struct ReadStream (Postgres Coderef)|ReadStream]]

#### `buffer`

- Types
	- [[type Buffer (Postgres Coderef)|Buffer]]
	- [[type BufferDesc (Postgres Coderef)|BufferDesc]]
	- [[type BufferStrategyControl (Postgres Coderef)|BufferStrategyControl]]
- Funcs
	- [[func ClockSweepTick (Postgres Coderef)|ClockSweepTick]]
	- [[func GetVictimBuffer (Postgres Coderef)|GetVictimBuffer]]
	- [[func InvalidateVictimBuffer (Postgres Coderef)|InvalidateVictimBuffer]]
	- [[func StrategyGetBuffer (Postgres Coderef)|StrategyGetBuffer]]