---
tags:
  - database
  - db-postgresql
  - story
date: 2024-12-16
---
## 개요

- 본 작물에서는 PostgreSQL 에서 sequential scan (가령 `SELECT * FROM table;`) 을 했을때의 function call stack 을 정리해 본다.

## Stack

- 우선 [[Common Query Execution (Postgres Coderef)|공통 로직]] 을 처리한 다음, [[# Executor, Access Method Call Path|Executor, Access Method Call Path]] 부터 시작한다.

### Executor, Access Method Call Path

- [[func ExecSeqScan (Postgres Coderef)|ExecSeqScan()]]
	- [[func ExecScan (Postgres Coderef)|ExecScan()]]
		- [[func ExecScanFetch (Postgres Coderef)|ExecScanFetch()]]
			- [[func SeqNext (Postgres Coderef)|SeqNext()]]
				- [[func table_beginscan (Postgres Coderef)|table_beginscan()]]
					- [[func heap_beginscan (Postgres Coderef)|heap_beginscan()]]
				- [[func table_scan_getnextslot (Postgres Coderef)|table_scan_getnextslot()]]
					- [[func heap_getnextslot (Postgres Coderef)|heap_getnextslot()]]
						- [[func heapgettup_pagemode (Postgres Coderef)|heapgettup_pagemode()]]
							- [[func heapgettup_continue_page (Postgres Coderef)|heapgettup_continue_page()]]
							- [[func heap_fetch_next_buffer (Postgres Coderef)|heap_fetch_next_buffer()]]
								- [[#`read_stream_next_buffer()` Call Path|Call path: read_stream_next_buffer()]]

### `read_stream_next_buffer()` Call Path

- [[func read_stream_next_buffer (Postgres Coderef)|read_stream_next_buffer()]]
	- [[#`read_stream_get_block()` Call Path|Call Path: read_stream_get_block()]]
	- [[func StartReadBuffersImpl (Postgres Coderef)|StartReadBuffer()]]
		- [[#`StartReadBuffersImpl()` Call Path|Call Path: StartReadBuffersImpl()]]
	- [[#`read_stream_look_ahead()` Call Path|Call Path: read_stream_look_ahead()]]
	- [[func WaitReadBuffers (Postgres Coderef)|WaitReadBuffers()]]
		- [[func WaitReadBuffersCanStartIO (Postgres Coderef)|WaitReadBuffersCanStartIO()]]
		- [[func smgrreadv (Postgres Coderef)|smgrreadv()]]
			- [[func mdreadv (Postgres Coderef)|mdreadv()]]
				- [[func FileReadV (Postgres Coderef)|FileReadV()]]
	- [[#`read_stream_look_ahead()` Call Path|Call Path: read_stream_look_ahead()]]

### `StartReadBuffersImpl()` Call Path

- [[func StartReadBuffersImpl (Postgres Coderef)|StartReadBuffersImpl()]]
	- [[func PinBufferForBlock (Postgres Coderef)|PinBufferForBlock()]]
		- [[func BufferAlloc (Postgres Coderef)|BufferAlloc()]]
	- [[func smgrprefetch (Postgres Coderef)|smgrprefetch()]]
		- [[func mdprefetch (Postgres Coderef)|mdprefetch()]]
			- [[func FilePrefetch (Postgres Coderef)|FilePrefetch()]]

### `read_stream_get_block()` Call Path

- [[func read_stream_get_block (Postgres Coderef)|read_stream_get_block()]]
	- [[func heap_scan_stream_read_next_serial (Postgres Coderef)|heap_scan_stream_read_next_serial()]]
		- [[func heapgettup_initial_block (Postgres Coderef)|heapgettup_initial_block()]]
		- [[func heapgettup_advance_block (Postgres Coderef)|heapgettup_advance_block()]]

### `read_stream_look_ahead()` Call Path

- [[func read_stream_look_ahead (Postgres Coderef)|read_stream_look_ahead()]]
	- [[#`read_stream_get_block()` Call Path|Call Path: read_stream_get_block()]]
	- [[func read_stream_start_pending_read (Postgres Coderef)|read_stream_start_pending_read()]]
		- [[func StartReadBuffersImpl (Postgres Coderef)|StartReadBuffers()]]
			- [[#`StartReadBuffersImpl()` Call Path|Call Path: StartReadBuffersImpl()]]