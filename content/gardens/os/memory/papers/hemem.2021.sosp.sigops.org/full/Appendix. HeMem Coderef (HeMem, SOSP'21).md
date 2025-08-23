---
tags:
  - os
  - os-memory
  - paper-review
title: "(논문) HeMem: Scalable Tiered Memory Management for Big Data Applications and Real NVM, SOSP'21 (Code Ref)"
date: 2025-02-09
---
> [!info] 본 글은 논문 [[HeMem - Scalable Tiered Memory Management for Big Data Applications and Real NVM (SOSP'21)]] 의 [코드](https://github.com/cuhk-mass/hemem) 를 분석해본 글이다.

## 개요

- HeMem 의 코드를 간략하게 살펴보자.

## pebs_init()

> [!tip] 코드 위치
> - [pebs_init()](https://github.com/cuhk-mass/hemem/blob/03c3a06b80a7cead57fad53433fde34834381ede/src/pebs.c#L621-L689)

- 여기서는 [[Processor Event Based Sampling, PEBS (Intel Arch)|PEBS]] sampling 에 대한 전반적인 init 을 한다.
	- [src/pebs.c:629-636](https://github.com/cuhk-mass/hemem/blob/03c3a06b80a7cead57fad53433fde34834381ede/src/pebs.c#L629-L636) 에서는 PEBS 를 [perf_event_mmap_page](https://github.com/torvalds/linux/blob/2014c95afecee3e76ca4a56956a936e23283f05b/include/uapi/linux/perf_event.h#L577-L753) 라는 kernel 자료구조에 [perf_setup()](https://github.com/cuhk-mass/hemem/blob/03c3a06b80a7cead57fad53433fde34834381ede/src/pebs.c#L60-L97) 함수를 이용해 [[Memory-mapped File IO, MMAP (OS)|MMAP]] 하는 과정을 거친다. 즉, 이 메모리 공간을 읽음으로서 PEBS sampling 이 되는 것.
	- [src/pebs.c:638-667](https://github.com/cuhk-mass/hemem/blob/03c3a06b80a7cead57fad53433fde34834381ede/src/pebs.c#L638-L667) 에서는 사용할 [[Lock (Process)|Mutex]] 들을 초기화한다.
	- [src/pebs.c:669-677](https://github.com/cuhk-mass/hemem/blob/03c3a06b80a7cead57fad53433fde34834381ede/src/pebs.c#L669-L677) 에서는 사용할 ring buffer 들을 초기화한다.
- 그리고 아래의 코드에서 PEBS 를 sampling 하고 migration 하는 thread 들을 생성한다.

> [!tip] 코드 위치
> - [src/pebs.c:679-683](https://github.com/cuhk-mass/hemem/blob/03c3a06b80a7cead57fad53433fde34834381ede/src/pebs.c#L679-L683)

```c
int r = pthread_create(&scan_thread, NULL, pebs_scan_thread, NULL);
assert(r == 0);

r = pthread_create(&kswapd_thread, NULL, pebs_policy_thread, NULL);
assert(r == 0);
```

- 위 두 함수 중에서
	- [[#pebs_scan_thread()]] 에서는 주기적으로 PEBS sampling 을 수행하고
	- [[#pebs_policy_thread()]] 에서는 주기적으로 sampling 한 결과에 따라 migration 을 진행한다.

## pebs_scan_thread()

> [!tip] 코드 위치
> - [pebs_scan_thread()](https://github.com/cuhk-mass/hemem/blob/03c3a06b80a7cead57fad53433fde34834381ede/src/pebs.c#L111-L214)

- 여기서는 core 의 개수 (`PEBS_NPROCS`) 와 access type 의 개수 (총 `NPBUFTYPES` 만큼 있고 `DRAMREAD`, `NVMREAD`, `WRITE` 세 종류가 있음) 에 따라 for loop 을 돌며 PEBS sampling 한다.
- 그리고 각 loop 마다 다음의 작업을 수행한다.

> [!tip] 코드 위치
> - [src/pebs.c:128](https://github.com/cuhk-mass/hemem/blob/03c3a06b80a7cead57fad53433fde34834381ede/src/pebs.c#L128)

```c
struct perf_event_mmap_page *p = perf_page[i][j];
```

- 일단 `perf_event_mmap_page` 구조체를 통해 mmap 된 PEBS 에 접근하여 sample 을 가져온다.

> [!tip] 코드 위치
> - [src/pebs.c:149](https://github.com/cuhk-mass/hemem/blob/03c3a06b80a7cead57fad53433fde34834381ede/src/pebs.c#L149)

```c
page = get_hemem_page(pfn);
```

- 그리고 *Page Frame Number* 를 이용해 [get_hemem_page()](https://github.com/cuhk-mass/hemem/blob/03c3a06b80a7cead57fad53433fde34834381ede/src/hemem.c#L1220-L1223) 로 HeMem 내부에서 관리하는 hash table 을 찾아 HeMem 이 관리하는 page metadata 를 찾아온다.
	- 보면 HeMem 에서는 system 의 모든 page 가 아닌 HeMem 에서 관리하는 page 들에 대해서만 tiered memory management 를 수행한다.
	- 즉, HeMem 이 userspace library 이기 때문에 이놈을 사용하는 client 의 page 들을 관리하는 것.

> [!tip] 코드 위치
> - [src/pebs.c:152-153](https://github.com/cuhk-mass/hemem/blob/03c3a06b80a7cead57fad53433fde34834381ede/src/pebs.c#L152-L153)

```c
page->accesses[j]++;
page->tot_accesses[j]++;
```

- 다음에는 access counter 를 증가시켜주고

> [!tip] 코드 위치
> - [src/pebs.c:154-168](https://github.com/cuhk-mass/hemem/blob/03c3a06b80a7cead57fad53433fde34834381ede/src/pebs.c#L154-L168)

```c
if (page->accesses[WRITE] >= HOT_WRITE_THRESHOLD) {
	if (!page->hot || !page->ring_present) {
		make_hot_request(page);
	}
}
else if (page->accesses[DRAMREAD] + page->accesses[NVMREAD] >= HOT_READ_THRESHOLD) {
	if (!page->hot || !page->ring_present) {
		make_hot_request(page);
	}
}
else if ((page->accesses[WRITE] < HOT_WRITE_THRESHOLD) && (page->accesses[DRAMREAD] + page->accesses[NVMREAD] < HOT_READ_THRESHOLD)) {
	if (page->hot || !page->ring_present) {
		make_cold_request(page);
	}
}
```

- 이 access counter 와 static threshold 를 비교해서 hotness 를 판단한다.
	- 보면 각 access type 에 대해 threshold 와 비교해 hotness 를 판단하고
	- 해당 page 가 판단된 hotness 와 다르다면 "request" 를 생성해서 해당 page 의 hotness 를 바꾼다.
	- 이 request 는 뒤에서 [[#pebs_policy_thread()]] 에서 처리된다. 즉, request 를 만들어 놓으면 이 policy thread 가 여기에 있는 page 들을 hotness 에 따른 list 에 넣는다.

> [!tip] 코드 위치
> - [src/pebs.c:172-176](https://github.com/cuhk-mass/hemem/blob/03c3a06b80a7cead57fad53433fde34834381ede/src/pebs.c#L172-L176)

```c
if (page->accesses[j] > PEBS_COOLING_THRESHOLD) {
	global_clock++;
	need_cool_dram = true;
	need_cool_nvm = true;
}
```

- 마지막으로 여기서는 access counter 와 `COOLING_THRESHOLD` 를 비교하여 cooling 이 필요한지 판단한다.
	- 그리고, cooling 이 필요하다면 flag 를 켜서 추후에 cooling 이 진행되도록 한다.

## pebs_policy_thread()

> [!tip] 코드 위치
> - [pebs_policy_thread()](https://github.com/cuhk-mass/hemem/blob/03c3a06b80a7cead57fad53433fde34834381ede/src/pebs.c#L390-L550)

- 이 함수를 요약하자면, [[#pebs_scan_thread()]] 에서 hot 이라고 판단한 NVM page 들을 DRAM 으로 옮기는 작업을 한다.

> [!tip] 코드 위치
> - [src/pebs.c:415-460](https://github.com/cuhk-mass/hemem/blob/03c3a06b80a7cead57fad53433fde34834381ede/src/pebs.c#L415-L460)

```c
num_ring_reqs = 0;
while(!ring_buf_empty(hot_ring) && num_ring_reqs < HOT_RING_REQS_THRESHOLD) {
	page = (struct hemem_page*)ring_buf_get(hot_ring);
	if (page == NULL) {
		continue;
	}

	update_current_cool_page(&cur_cool_in_dram, &cur_cool_in_nvm, page);
	page->ring_present = false;
	num_ring_reqs++;
	make_hot(page);
}
```

- 우선 ring buffer 를 쭉 훑으면서 [[#pebs_scan_thread()]] 에서의 request 들에 따라 각 page 를 해당 tier 의 hot, cold list 에 추가한다.
	- 여기서는 `free_ring` 에 있는 free page request 들을 각 tier 의 free page list (`dram_free_list`, `nvm_free_list`) 로 넣어주고
	- `hot_ring` 에 있는 hot page request 들을 각 tier 의 hot page list (`dram_hot_list`, `nvm_hot_list`) 로 넣어주며
	- 또한 `cold_ring` 에 있는 cold page request 들을 각 tier 의 cold page list (`dram_cold_list`, `nvm_cold_list`) 로 넣어준다.
	- 위에 적어놓은 코드는 `hot_ring` 을 처리하는 코드만 복사해온 것.

> [!tip] 코드 위치
> - [src/pebs.c:462-464](https://github.com/cuhk-mass/hemem/blob/03c3a06b80a7cead57fad53433fde34834381ede/src/pebs.c#L462-L464)

```c
// move each hot NVM page to DRAM
for (migrated_bytes = 0; migrated_bytes < PEBS_KSWAPD_MIGRATE_RATE;) {
	p = dequeue_fifo(&nvm_hot_list);
```

- 그리고 loop 를 돌며 NVM 의 hot page 들을 DRAM 으로 옮긴다.
	- 우선 위의 코드에서 보이는 것 처럼 `nvm_hot_list` 에서 page 를 하나 갖고온다.

> [!tip] 코드 위치
> - [src/pebs.c:472-477](https://github.com/cuhk-mass/hemem/blob/03c3a06b80a7cead57fad53433fde34834381ede/src/pebs.c#L472-L477)

```c
if ((p->accesses[WRITE] < HOT_WRITE_THRESHOLD) && (p->accesses[DRAMREAD] + p->accesses[NVMREAD] < HOT_READ_THRESHOLD)) {
	// it has been cooled, need to move it into the cold list
	p->hot = false;
	enqueue_fifo(&nvm_cold_list, p); 
	continue;
}
```

- 만약 해당 page 가 원래는 hot list 에 있었으나, 이후의 cooling 작업에 의해 cold page 가 된 경우, 위의 코드에 의해 이놈은 다시 `nvm_cold_list` 로 옮겨진다.

> [!tip] 코드 위치
> - [src/pebs.c:480-481](https://github.com/cuhk-mass/hemem/blob/03c3a06b80a7cead57fad53433fde34834381ede/src/pebs.c#L480-L481)

```c
// find a free DRAM page
np = dequeue_fifo(&dram_free_list);
```

- 만약 그렇지 않고 이놈이 확실히 DRAM 으로 올라가야되는 놈이라면, 위 코드에서처럼 DRAM 에서 free page 를 하나 가져온다.

> [!tip] 코드 위치
> - [src/pebs.c:483-505](https://github.com/cuhk-mass/hemem/blob/03c3a06b80a7cead57fad53433fde34834381ede/src/pebs.c#L483-L505)

```c
if (np != NULL) {
	assert(!(np->present));

	LOG("%lx: cold %lu -> hot %lu\t slowmem.hot: %lu, slowmem.cold: %lu\t fastmem.hot: %lu, fastmem.cold: %lu\n",
	p->va, p->devdax_offset, np->devdax_offset, nvm_hot_list.numentries, nvm_cold_list.numentries, dram_hot_list.numentries, dram_cold_list.numentries);

	old_offset = p->devdax_offset;
	pebs_migrate_up(p, np->devdax_offset);
	np->devdax_offset = old_offset;
	np->in_dram = false;
	np->present = false;
	np->hot = false;
	for (int i = 0; i < NPBUFTYPES; i++) {
		np->accesses[i] = 0;
		np->tot_accesses[i] = 0;
	}

	enqueue_fifo(&dram_hot_list, p);
	enqueue_fifo(&nvm_free_list, np);

	migrated_bytes += pt_to_pagesize(p->pt);
	break;
}
```

- 만약 DRAM 에 free page 가 있으면, 위의 코드에서 이 free page 에 NVM 의 hot page 를 복사하며 migrate 를 진행한다.
	- 보면 [pebs_migrate_up()](https://github.com/cuhk-mass/hemem/blob/03c3a06b80a7cead57fad53433fde34834381ede/src/pebs.c#L231-L244) 를 통해 page 를 promotion 하고
	- Access count 들을 다시 0으로 초기화하며
	- `dram_hot_list` 에다가는 migration 한 DRAM page 를 넣고
	- NVM 에 있는 해당 page 는 이제 DRAM 으로 promotion 되었으므로 `nvm_free_list` 에다가 이 NVM page 를 넣는다.

> [!tip] 코드 위치
> - [src/pebs.c:507-508](https://github.com/cuhk-mass/hemem/blob/03c3a06b80a7cead57fad53433fde34834381ede/src/pebs.c#L507-L508)

```c
// no free dram page, try to find a cold dram page to move down
cp = dequeue_fifo(&dram_cold_list);
```

- 하지만 DRAM 에 free page 가 없을 경우에는, DRAM 의 cold page 를 하나 NVM 으로 옮긴 다음에 여기에다 NVM 의 hot page 를 채워넣는다.
	- 따라서 우선 위의 코드에서 보이는 것처럼 `dram_cold_list` 에서 page 를 하나 가져온 후

> [!tip] 코드 위치
> - [src/pebs.c:516-537](https://github.com/cuhk-mass/hemem/blob/03c3a06b80a7cead57fad53433fde34834381ede/src/pebs.c#L516-L537)

```c
// find a free nvm page to move the cold dram page to
np = dequeue_fifo(&nvm_free_list);
if (np != NULL) {
	assert(!(np->present));

	LOG("%lx: hot %lu -> cold %lu\t slowmem.hot: %lu, slowmem.cold: %lu\t fastmem.hot: %lu, fastmem.cold: %lu\n",
	cp->va, cp->devdax_offset, np->devdax_offset, nvm_hot_list.numentries, nvm_cold_list.numentries, dram_hot_list.numentries, dram_cold_list.numentries);

	old_offset = cp->devdax_offset;
	pebs_migrate_down(cp, np->devdax_offset);
	np->devdax_offset = old_offset;
	np->in_dram = true;
	np->present = false;
	np->hot = false;
	for (int i = 0; i < NPBUFTYPES; i++) {
		np->accesses[i] = 0;
		np->tot_accesses[i] = 0;
	}

	enqueue_fifo(&nvm_cold_list, cp);
	enqueue_fifo(&dram_free_list, np);
}
```

- 위 코드에서 알 수 있는 것 처럼 해당 page 를 [pebs_migrate_down()](https://github.com/cuhk-mass/hemem/blob/03c3a06b80a7cead57fad53433fde34834381ede/src/pebs.c#L216-L229) 를 이용해 NVM 으로 옮긴다.

> [!tip] 코드 위치
> - [src/pebs.c:479-481](https://github.com/cuhk-mass/hemem/blob/03c3a06b80a7cead57fad53433fde34834381ede/src/pebs.c#L479-L481)

```c
for (tries = 0; tries < 2; tries++) {
	// find a free DRAM page
	np = dequeue_fifo(&dram_free_list);
```

- 그리고는 for loop 에 의해 다시 위로 올라가 [pebs_migrate_up()](https://github.com/cuhk-mass/hemem/blob/03c3a06b80a7cead57fad53433fde34834381ede/src/pebs.c#L231-L244) 를 통해 page 를 promotion 한다.
	- 위의 for loop 을 보면 이 것은 최대 두번 실행된다. 즉, 두번의 try 동안 DRAM 의 free page 를 찾아 promotion 하지 못하면 실패하게 되는 것.