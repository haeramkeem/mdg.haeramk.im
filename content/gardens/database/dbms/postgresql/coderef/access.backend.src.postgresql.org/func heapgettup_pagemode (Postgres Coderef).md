---
tags:
  - database
  - db-postgresql
aliases:
  - heapgettup_pagemode
  - heapgettup_pagemode()
date: 2024-12-15
---
> [!info]- 코드 위치 (v17.1)
> - File path: `src/backend/access/heap/heapam.c`
> - Line: `957`
> - Link: [heapgettup_pagemode()](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L943-L1037)
> - VIM
> ```
> vi src/backend/access/heap/heapam.c +957
> ```

## Overview

- Heap page 에서 [[struct HeapTupleData (Postgres Coderef)|Heap tuple]] 을 하나 읽어 [[struct TableScanDesc (Postgres Coderef)|TableScanDesc]] 의 current tuple 을 업데이트한다.
- 본 함수에서는 heap page 를 하나 읽어 visible tuple 을 [[struct TableScanDesc (Postgres Coderef)|TableScanDesc]] 에 전부 때려넣은 뒤에, 해당 tuple 들을 모두 소진할 때까지는 이 함수가 호출될때마다 저 visible tuple 에서 하나씩 꺼내 current tuple 을 업데이트하는 식으로 진행된다.
- 따라서 (A) 새로운 page 를 fetch 해야 하는 경우와 (B) 기존것을 계속 사용하는 경우를 나눠서 생각해보자.

## Line Ref

### Local Variable

- [tuple](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L962): [[struct TableScanDesc (Postgres Coderef)|TableScanDesc]] 의 current tuple 을 가리키는 pointer 이다.
- [page](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L963): Buffer page data 를 가리키는 pointer 이다.
- [lineindex](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L964): [[struct TableScanDesc (Postgres Coderef)|TableScanDesc]] 의 visible tuple array 에서의 현재 소진하고자 하는 tuple 에 대한 index 이다.
- [linesleft](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L965): [[struct TableScanDesc (Postgres Coderef)|TableScanDesc]] 의 visible tuple array 에서 아직 소진하지 않은 tuple 들의 개수이다.
- [lpp](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L1007): Tuple ID 이다.
- [lineoff](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L1008): 소진하고자 하는 tuple 의 page 내에서의 offset 이다.

### (A) Fetch New Page

- [L967-L980](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L967-L980): Page 를 새로 fetch 해야 한다면, `scan->rs_inited` 가 `false` 이다. 따라서 이부분은 skip 된다.
- [L982-L1027](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L982-L1027): Page 를 fetch 해오고, visible tuple 을 정리한 다음, current tuple 을 업데이트한다.
	- [L988-L994](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L988-L994): [[func heap_fetch_next_buffer (Postgres Coderef)|heap_fetch_next_buffer()]] 를 호출해 다음 page 를 읽어 buffer 에 올리고 [[struct TableScanDesc (Postgres Coderef)|TableScanDesc]] 에서 해당 buffer 를 참조하도록 한다.
	- [L996-L997](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L996-L997): [[func heap_prepare_pagescan (Postgres Coderef)|heap_prepare_pagescan()]] 를 호출해 visible tuple 을 전부 골라 [[struct TableScanDesc (Postgres Coderef)|TableScanDesc]] 에 넣는다.
	- [L998-L1000](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L998-L1000): 새로운 page 의 tuple 들을 iterate 하기 위한 변수들을 설정한다.
		- `linesleft`: Visible tuple 를 하나도 소진하지 않았기 때문에, `scan->rs_ntuples` 로 설정된다.
		- `lineindex`: 마찬가지로 visible tuple 을 하나도 소진하지 않았기 때문에, forward direction 이면 `0`, backward direction 이면 `linesleft - 1` 로 설정된다.
	- [L1005-L1026](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L1005-L1026): Visible tuple 을 하나씩 iterate 하며 소진한다.
		- [L1010-L1012](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L1010-L1012): 현재 소진하고자 하는 tuple (`scan->rs_vistuples[lineindex]`) 에 대한 `lineoff` 와 `lpp` 를 설정한다.
		- [L1014-L1016](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L1014-L1016): 현재 소진하고자 하는 tuple 을 `tuple` 에 등록한다.
		- [L1018-L1022](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L1018-L1022): 만약 현재 소진하고자 하는 tuple 이 scan key 와 맞지 않는다면, `for` loop 으로 다시 처음으로 돌아가 다음 tuple 을 소진한다.
		- [L1024-L1025](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L1024-L1025): [[struct TableScanDesc (Postgres Coderef)|TableScanDesc]] 의 current tuple index (`scan->rs_cindex`) 를 `lineindex` 로 설정한 뒤 return 한다.

### (B) Use Existing Page

- [L967-L980](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L967-L980): 기존의 page 를 계속 사용하는 경우, 다음 visible tuple 을 소진하기 위한 변수들을 설정한다.
	- [L969-L970](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L969-L970): Buffer 에서 page 를 가져와 `page` 를 설정한다.
	- [L972](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L972): [[struct TableScanDesc (Postgres Coderef)|TableScanDesc]] 의 current index 에서 scan direction 에 따라 1을 더하거나 빼서 `lineindex` 를 설정한다.
	- [L973-L977](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L973-L977): Scan direction 에 따라 `linesleft` 를 설정한다.
	- [L979](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L979): 이후 1005 번째 줄로 바로 jump 한다.
- [L1005-L1026](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L1005-L1026): Visible tuple 을 하나씩 iterate 하며 소진한다.
	- [L1010-L1012](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L1010-L1012): 현재 소진하고자 하는 tuple (`scan->rs_vistuples[lineindex]`) 에 대한 `lineoff` 와 `lpp` 를 설정한다.
	- [L1014-L1016](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L1014-L1016): 현재 소진하고자 하는 tuple 을 `tuple` 에 등록한다.
	- [L1018-L1022](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L1018-L1022): 만약 현재 소진하고자 하는 tuple 이 scan key 와 맞지 않는다면, `for` loop 으로 다시 처음으로 돌아가 다음 tuple 을 소진한다.
	- [L1024-L1025](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L1024-L1025): [[struct TableScanDesc (Postgres Coderef)|TableScanDesc]] 의 current tuple index (`scan->rs_cindex`) 를 `lineindex` 로 설정한 뒤 return 한다.
- [L1029-L1036](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/access/heap/heapam.c#L1029-L1036): 만약 더 이상 visible tuple 이 해당 page 에 없다면, [[struct TableScanDesc (Postgres Coderef)|TableScanDesc]] 의 값들을 초기화하고 `scan->rs_inited` 를 `false` 로 설정해 다음에 이 함수가 호출되었을 때 (A) 를 수행하도록 한다.