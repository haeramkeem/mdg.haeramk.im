---
tags:
  - database
  - db-postgresql
date: 2024-11-21
---
## `src/backend`

### `access`

- Types
	- [[struct HeapTupleData (Postgres Coderef)|HeapTupleData]]
	- [[struct HeapTupleHeaderData (Postgres Coderef)|HeapTupleHeaderData]]
- Funcs
	- [[func heap_beginscan (Postgres Coderef)|heap_beginscan]]
	- [[func heap_fetch_next_buffer (Postgres Coderef)|heap_fetch_next_buffer]]
	- [[func heap_getnextslot (Postgres Coderef)|heap_getnextslot]]
	- [[func heapgettup_pagemode (Postgres Coderef)|heapgettup_pagemode]]
	- [[func initscan (Postgres Coderef)|initscan]]
	- [[func table_beginscan (Postgres Coderef)|table_beginscan]]
	- [[func table_scan_getnextslot (Postgres Coderef)|table_scan_getnextslot]]

### `executor`

- Types
	- [[struct TupleTableSlot (PostgresCoderef)|TupleTableSlot]]
- Funcs
	- [[func ExecScan (Postgres Coderef)|ExecScan]]
	- [[func ExecScanFetch (Postgres Coderef)|ExecScanFetch]]
	- [[func ExecSeqScan (Postgres Coderef)|ExecSeqScan]]
	- [[func ExecStoreBufferHeapTuple (Postgres Coderef)|ExecStoreBufferHeapTuple]]
	- [[func SeqNext (Postgres Coderef)|SeqNext]]
	- [[func tts_buffer_heap_store_tuple (Postgres Coderef)|tts_buffer_heap_store_tuple]]

### `postmaster`

- Funcs
	- [[gardens/database/dbms/postgresql/coderef/postmaster.backend.src.postgresql.org/func BackendStartup (Postgres Coderef)|BackendStartup]]

### `storage`

#### `aio`

- Types
	- [[struct ReadStream (Postgres Coderef)|ReadStream]]
- Funcs
	- [[func read_stream_begin_relation (Postgres Coderef)|read_stream_begin_relation]]

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