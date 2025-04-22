---
tags:
  - os
  - os-memory
  - paper-review
date: 2025-01-29
title: "(논문) Tiered Memory Management: Access Latency is the Key!, SOSP'24 (Code Ref)"
---
> [!info] 본 글은 논문 [Tiered Memory Management: Access Latency is the Key! (SOSP 2024)](https://dl.acm.org/doi/10.1145/3694715.3695968) 의 [코드](https://github.com/webglider/hemem/tree/1b442e5758b14c557cfa06bbc93ba6cec0735387) 를 분석해본 글이다.

> [!info]- 참고한 것들
> - [3rd Gen Intel Xeon Processor Scalable Family, Codename Ice Lake, Uncore Performance Monitoring Reference Manual](https://www.intel.com/content/www/us/en/content-details/639778/3rd-gen-intel-xeon-processor-scalable-family-codename-ice-lake-uncore-performance-monitoring-reference-manual.html)
> - [rdtscp](https://modoocode.com/en/inst/rdtscp)

## 개요

- 여기서는 [[Tiered Memory Management - Access Latency is the Key! (SOSP'24)|Colloid]] 의 [[HeMem - Scalable Tiered Memory Management for Big Data Applications and Real NVM (SOSP'21)|HeMem]] implementation code 를 살펴보도록 하자.
- Code 는 [여기](https://github.com/webglider/hemem/tree/1b442e5758b14c557cfa06bbc93ba6cec0735387) 에 있다.

## Uncore Performance Monitoring Registers

- CHA 는 [[Uncore (Intel CPU Arch)|Uncore]] subsystem 에 속하고 [[Model-Specific Register, MSR (Intel CPU Arch)|MSR]] 레지스터를 통해 접근한다.
- 때문에 앞으로 여러번 등장할 아래의 MSR address 표를 먼저 살펴보자.

![[Pasted image 20250129184343.png]]
> 3rd Gen Intel Xeon Processor Scalable Family, Codename Ice Lake, Uncore Performance Monitoring Reference Manual pp.31

- 여기서 `Ctr` 은 counter register 로, counter 값을 가져오는 register 를 의미한다.
- 그리고 `Ctrl` 은 control register 로, CHA counter 를 설정하기 위한 register 이다.
- `Filter` 은 counter 값을 filtering 하기 위한 filter 를 설정하는 filter register 이다.
- 각 셀의 16진수 값들은 해당 register 에 대한 주소값이다.

## colloid_setup()

> [!tip] 코드 위치
> - [colloid_setup()](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L168-L239)

- 일단 여기에서 stat 들을 init 하는 것을 확인할 수 있다.
- 우선 MSR 을 file 로서 open 한다.

> [!tip] 코드 위치
> - [src/pebs.c:169-175](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L169-L175)

```c
// Open msr file
char filename[100];
sprintf(filename, "/dev/cpu/%d/msr", cpu);
colloid_msr_fd = open(filename, O_RDWR);
if(colloid_msr_fd == -1) {
	perror("Failed to open msr file");
}
```

- 그리고 모든 CHA box 들을 순회하면서, 다음의 작업을 해준다:

### 1. Init filter

- 우선 filter 를 init 하는데, *Colloid* 에서는 filter 를 사용하지 않으므로 filter 를 `0x00000000` 으로 초기화해준다.

> [!tip] 코드 위치
> - [src/pebs.c:183-189](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L183-L189)

```c
msr_num = CHA_MSR_PMON_FILTER0_BASE + (0xE * cha); // Filter0
msr_val = 0x00000000; // default; no filtering
ret = pwrite(colloid_msr_fd,&msr_val,sizeof(msr_val),msr_num);
if (ret != 8) {
printf("wrmsr FILTER0 failed for cha: %d\n", cha);
	perror("wrmsr FILTER0 failed");
}
```

- 여기서 `CHA_MSR_PMON_FILTER0_BASE` 값은 아래와 같이 `0x0E05` 로 지정되는데,

> [!tip] 코드 위치
> - [src/pebs.c:29](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L29)

```c
#define CHA_MSR_PMON_FILTER0_BASE 0x0E05L
```

- 이 값은 [[#Uncore Performance Monitoring Registers|이 표]] 에서 `CHA 0` 의 `Filter 0` 에 해당하는 값이다. 즉, 이 값을 base 로 CHA box 번호에 따라 address 를 계산하는 것.
- 그리고 표에서는 CHA box 번호가 증가할 때마다 `Filter 0` 의 주소가 `0xE` 씩 커진다. 그래서 위 코드에 `(0xE * cha)` 로 되어 있는 것.

### 2. Init counters

- 그리고 다음은 Occupancy 와 Insert counter 를 초기화한다.

> [!tip] 코드 위치
> - [src/pebs.c:198-210](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L198-L210)

```c
msr_num = CHA_MSR_PMON_CTL_BASE + (0xE * cha) + 0; // counter 0
msr_val = (cha%2==0)?(0x00c8168600400136):(0x00c8170600400136); // TOR Occupancy, DRd, Miss, local/remote on even/odd CHA boxes
ret = pwrite(colloid_msr_fd,&msr_val,sizeof(msr_val),msr_num);
if (ret != 8) {
	perror("wrmsr COUNTER0 failed");
}

msr_num = CHA_MSR_PMON_CTL_BASE + (0xE * cha) + 1; // counter 1
msr_val = (cha%2==0)?(0x00c8168600400135):(0x00c8170600400135); // TOR Inserts, DRd, Miss, local/remote on even/odd CHA boxes
ret = pwrite(colloid_msr_fd,&msr_val,sizeof(msr_val),msr_num);
if (ret != 8) {
	perror("wrmsr COUNTER1 failed");
}
```

- 여기서는 우선 `CHA_MSR_PMON_CTL_BASE` 은 `0x0E01L` 로 설정되고,

> [!tip] 코드 위치
> - [src/pebs.c:28](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L28)

```c
#define CHA_MSR_PMON_CTL_BASE 0x0E01L
```

- 마찬가지로 이 값은 [[#Uncore Performance Monitoring Registers|위 표]] 에서 `CHA 0` 에 대한 `Ctrl 0` 의 address 인 것을 알 수 있다.
	- 즉, filter 때와 마찬가지로 addressing 을 하는 것.
- 그리고 `msr_val` 의 값들에 대해 살펴보자. 이놈은 아래와 같은 구조로 되어 있다.

![[Pasted image 20250129184124.png]]
> 3rd Gen Intel Xeon Processor Scalable Family, Codename Ice Lake, Uncore Performance Monitoring Reference Manual pp.87

- 우선 하위 4byte (`0x00400135`, `0x00400136`) 부터 먼저 살펴보자.
- 저기 `Event Select` field 에의 `TOR Inserts` 와 `TOR Occupancy` 의 값은 다음과 같다.
	- `TOR` 은 table of request 로, request queue 라고 생각하면 된다.

![[Pasted image 20250129184022.png]]
> 3rd Gen Intel Xeon Processor Scalable Family, Codename Ice Lake, Uncore Performance Monitoring Reference Manual pp.92

- 즉, 저 4byte 중에서 `0x35` 하고 `0x36` 이 각각 `TOR Inserts` 와 `TOR Occupancy` 를 뜻하는 것.
- 그리고 다음 `0x01` 은 Umask (Unit mask) 인데, 이 값이 의미하는 바는 상위 4byte 에서 알아보자.
- 또한 다음의 `0x4` 는 `enable` field 로, local counter 를 enable 한다는 의미이다.

![[Pasted image 20250129185047.png]]
> 3rd Gen Intel Xeon Processor Scalable Family, Codename Ice Lake, Uncore Performance Monitoring Reference Manual pp.24

- 그리고 중간에 지나친 Unit mask 와 나머지 4byte (`0x00c81686` 하고 `0x00c81706`) 를 알아보자.
	- Ice lake 부터는 Unit mask field 와 Unit mask extend field 를 합쳐서 실제 Unit mask 를 설정하게 된다.
- 우선, 위 코드를 보면 CHA 번호가 짝수면 local socket (default tier) 이고, 홀수면 remote socket (alternate tier) 인 것을 알 수 있을 것이다.
- 위 코드에서 local socket 에서의 insert counter 를 위한 unit mask field 와 unit mask extend field 값은 다음과 같다:
	- Unit mask field: `0x01`
	- Unit mask extend field: `0x00c81686`
- 그리고 이 값에 대한 설명은 다음과 같다:
	- 보면, 이 값은 DRd (data read), locally-attached DDR memory request 인 것을 알 수 있다.

![[Pasted image 20250129185905.png]]
> 3rd Gen Intel Xeon Processor Scalable Family, Codename Ice Lake, Uncore Performance Monitoring Reference Manual pp.126

- 이 값은 occupancy counter 에도 동일하다.

![[Pasted image 20250129185709.png]]
> 3rd Gen Intel Xeon Processor Scalable Family, Codename Ice Lake, Uncore Performance Monitoring Reference Manual pp.132

- 또한 remote socket 에서의 insert counter 를 위한 unit mask field 와 unit mask extend field 값은 다음과 같다:
	- Unit mask field: `0x01`
	- Unit mask extend field: `0x00c81706`
- 그리고 이 값에 대한 설명은 다음과 같다:
	- 보면, 이 값은 DRd (data read), remotely-attached DDR memory request 인 것을 알 수 있다.

![[Pasted image 20250129191927.png]]
> 3rd Gen Intel Xeon Processor Scalable Family, Codename Ice Lake, Uncore Performance Monitoring Reference Manual pp.126

- 마찬가지로 이 값은 occupancy counter 에도 동일하다.

![[Pasted image 20250129191945.png]]
> 3rd Gen Intel Xeon Processor Scalable Family, Codename Ice Lake, Uncore Performance Monitoring Reference Manual pp.132

- 즉, 정리하자면 이 unit mask 로 어떤 tier 의 memory 에 대한 request 를 count 할지 지정하게 된다.

### 3. Init clocktics

- 다음으로는 timing 을 위해 clocktick counter 를 초기화해준다.

> [!tip] 코드 위치
> - [src/pebs.c:212-217](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L212-L217)

```c
msr_num = CHA_MSR_PMON_CTL_BASE + (0xE * cha) + 2; // counter 2
msr_val = 0x400000; // CLOCKTICKS
ret = pwrite(colloid_msr_fd,&msr_val,sizeof(msr_val),msr_num);
if (ret != 8) {
	perror("wrmsr COUNTER2 failed");
}
```

- 여기서 `msr_val` 이 `0x400000` 인 것은 clocktick 의 event select 가 `0x00` 이기 때문이다:

![[Pasted image 20250201125501.png]]

> 3rd Gen Intel Xeon Processor Scalable Family, Codename Ice Lake, Uncore Performance Monitoring Reference Manual pp.92

### Init stats

- 위의 내용까지가 각 CHA box 를 순회하면서 counter 들을 Init 하는 내용이었고, 마지막으로 HeMem + Colloid 에서 사용할 statistics 들을 초기화하면서 이 함수는 끝난다.

> [!tip] 코드 위치
> - [src/pebs.c:220-238](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L220-L238)

```c
// Initialize stats
for(cha = 0; cha < NUM_CHA_BOXES; cha++) {
	for(ctr = 0; ctr < NUM_CHA_COUNTERS; ctr++) {
		cur_ctr_tsc[cha][ctr] = 0;
		cur_ctr_val[cha][ctr] = 0;
		sample_cha_ctr(cha, ctr);
	}
}

smoothed_occ_local = 0.0;
occ_local = 0.0;
smoothed_occ_remote = 0.0;
occ_remote = 0.0;
smoothed_inserts_local = 0.0;
inserts_local = 0.0;
smoothed_inserts_remote = 0.0;
inserts_remote = 0.0;
p_lo = 0.0;
p_hi = 1.0;
```

## sample_cha_ctr()

> [!tip] 코드 위치
> - [sample_cha_ctr()](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L152-L166)

- 이 함수에서는 CHA counter 를 읽는 것을 한다.

> [!tip] 코드 위치
> - [src/pebs.c:157-161](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L157-L161)

```c
msr_num = CHA_MSR_PMON_CTR_BASE + (0xE * cha) + ctr;
ret = pread(colloid_msr_fd, &msr_val, sizeof(msr_val), msr_num);
if (ret != sizeof(msr_val)) {
	perror("ERROR: failed to read MSR");
}
```

- 여기에서도 MSR 을 읽는 것은 유사하게 작동한다: `CHA_MSR_PMON_CTR_BASE` 값은 [[#Uncore Performance Monitoring Registers|위 표]] 에서 `CHA 0` 의 `Ctr 0` 에 해당하는 `0x0E08` 로 설정되고,

> [!tip] 코드 위치
> - [src/pebs.c:32](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L32)

```c
#define CHA_MSR_PMON_CTR_BASE 0x0E08L
```

- 이것과 `cha`, `ctr` 을 조합해서 해당 register 의 값을 읽어온다.
- 읽어온 값은 아래처럼 기존의 `cur_` 값을 `prev_` 로 옮기고 `cur_` 을 업데이트하는 것으로 저장된다.
- 또한, 읽어왔을 때의 시간도 `rdtscp()` (read timestamp counter and process ID) 로 저장한다.

> [!tip] 코드 위치
> - [src/pebs.c:162-165](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L162-L165)

```c
prev_ctr_val[cha][ctr] = cur_ctr_val[cha][ctr];
cur_ctr_val[cha][ctr] = msr_val;
prev_ctr_tsc[cha][ctr] = cur_ctr_tsc[cha][ctr];
cur_ctr_tsc[cha][ctr] = rdtscp();
```

## colloid_update_stats()

> [!tip] 코드 위치
> - [colloid_update_stats()](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L241C13-L274)

- 이 함수에서는 [[#sample_cha_ctr()]] 를 호출해 CHA counter 를 읽어오고, (counter 값이 아닌) occupancy 와 insert count 를 계산한다.
- 일단 아래에서 counter value 들을 다 읽어온다.
	- 여기서 `CHA0` 은 local, `CHA1` 은 remote 이고
	- `CTR0` 은 occupancy, `CTR1` 은 inserts 이다.

> [!tip] 코드 위치
> - [src/pebs.c:244-249](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L244-L249)

```c
// Sample counters and update state
// TODO: For starters using CHA0 for local and CHA1 for remote
sample_cha_ctr(0, 0); // CHA0 occupancy
sample_cha_ctr(0, 1); // CHA0 inserts
sample_cha_ctr(1, 0);
sample_cha_ctr(1, 1);
```

- 그리고 다음의 코드에서 occupancy 를 계산한다.
	- 보면 `cur_` 와 `prev_` 간의 차이를 통해 두 counter 값의 차이로 occupancy 값 (`cum_occ`) 을 계산하고,
	- 그것을 시간차 (`delta_tsc`) 로 나눠 단위시간당 occupancy (`cur_occ`) 를 계산하며
	- 여기서 EWMA 로 값을 조정해 `smoothed_occ_local` 을 구해내는 것을 알 수 있다.

> [!tip] 코드 위치
> - [src/pebs.c:251-255](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L251-L255)

```c
cum_occ = cur_ctr_val[0][0] - prev_ctr_val[0][0];
delta_tsc = cur_ctr_tsc[0][0] - prev_ctr_tsc[0][0];
cur_occ = ((double)cum_occ)/((double)delta_tsc);
occ_local = cur_occ;
smoothed_occ_local = COLLOID_EWMA*cur_occ + (1-COLLOID_EWMA)*smoothed_occ_local;
```

- 또한 다음의 코드에서 inserts 를 계산한다.
	- 여기서도 마찬가지로 `cur_` 와 `prev_` 간의 차이를 통해 inserts 값 (`cum_inserts`) 를 구한다.
	- 다만 이 값을 timestamp 로 나눠 rate 를 계산해야 되는데, 이것은 나중에 하는지 여기서는 주석처리되어 있고 `cum_inserts` 값이 그대로 `inserts_local` 로 들어가는 것을 알 수 있다.
	- 마지막으로 EWMA 로 값을 조정해 `smoothed_inserts_local` 를 계산하게 된다.

> [!tip] 코드 위치
> - [src/pebs.c:257-261](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L257-L261)

```c
cum_inserts = cur_ctr_val[0][1] - prev_ctr_val[0][1];
// delta_tsc = cur_ctr_tsc[0][1] - prev_ctr_tsc[0][1];
// cur_rate = ((double)cum_inserts)/((double)delta_tsc);
inserts_local = (double)cum_inserts;
smoothed_inserts_local = COLLOID_EWMA*((double)cum_inserts) + (1-COLLOID_EWMA)*smoothed_inserts_local;
```

- 위의 두 코드는 local 에 관한 것으로, 그 아래에서 remote 에 대해서도 동일하게 수행하는 것을 알 수 있다.

> [!tip] 코드 위치
> - [src/pebs.c:263-273](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L263-L273)

```c
cum_occ = cur_ctr_val[1][0] - prev_ctr_val[1][0];
delta_tsc = cur_ctr_tsc[1][0] - prev_ctr_tsc[1][0];
cur_occ = ((double)cum_occ)/((double)delta_tsc);
occ_remote = cur_occ;
smoothed_occ_remote = COLLOID_EWMA*cur_occ + (1-COLLOID_EWMA)*smoothed_occ_remote;

cum_inserts = cur_ctr_val[1][1] - prev_ctr_val[1][1];
// delta_tsc = cur_ctr_tsc[1][1] - prev_ctr_tsc[1][1];
// cur_rate = ((double)cum_inserts)/((double)delta_tsc);
inserts_remote = (double)cum_inserts;
smoothed_inserts_remote = COLLOID_EWMA*((double)cum_inserts) + (1-COLLOID_EWMA)*smoothed_inserts_remote;
```

## pebs_init()

> [!tip] 코드 위치
> - [pebs_init()](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L1772-L1875)

- 여기서는 [[Appendix. HeMem Coderef (HeMem, SOSP'21)#pebs_init()|HeMem 의 pebs_init()]] 와 유사하게, sampling thread 인 [[#pebs_scan_thread()]] 와 migration thread 인 [[#pebs_policy_thread()]] 를 생성한다.

## pebs_scan_thread()

> [!tip] 코드 위치
> - [pebs_scan_thread()](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L296-L439)

- 전체적으로는 [[Appendix. HeMem Coderef (HeMem, SOSP'21)#pebs_scan_thread()|HeMem 의 pebs_scan_thread()]] 에서와 유사하지만, 조금 다른점이 있다.

> [!tip] 코드 위치
> - [src/pebs.c:350-354](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L350-L354)

```c
#ifdef HISTOGRAM
if(!page->ring_present){
	histogram_update_request(page);
}
#else 
```

- 우선 HeMem 에서는 hotness 에 따른 ring 에 page 를 넣은 이후 ring 에서 꺼내며 각 tier 별 hotness list 에 page 를 넣는 식이었다면,
- Colloid 에서는 histogram bin 을 사용하여 빠르게 원하는 $\Delta p$ 를 찾도록 한다.
- 따라서 Colloid 에서는 hot, cold ring 이 아닌 `update_ring` 에 page 를 넣고 [[#pebs_policy_thread()]] 에서 해당 page 를 histogram 에 넣는다.

## pebs_policy_thread()

> [!tip] 코드 위치
> - [pebs_policy_thread()](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L841-L1637)

- 이 함수에서는 `update_ring` 을 비우며 page 들을 histogram bin 에 넣고 $\Delta p$ 에 따라 page 들을 migration 한다.

> [!tip] 코드 위치
> - [src/pebs.c:952-968](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L952-L968)

```c
#ifdef HISTOGRAM
num_ring_reqs = 0;
// handle requests from the update buffer
while(!ring_buf_empty(update_ring) && num_ring_reqs < HOT_RING_REQS_THRESHOLD) {
	page = (struct hemem_page*)ring_buf_get(update_ring);
	if (page == NULL) {
		continue;
	}

	#ifdef COOL_IN_PLACE
	update_current_cool_page(&cur_cool_in_dram, &cur_cool_in_nvm, page);
	#endif
	page->ring_present = false;
	num_ring_reqs++;
	histogram_update(page, page->accesses[DRAMREAD] + page->accesses[NVMREAD]);
}
#else
```

- 일단 위의 코드가 `update_ring` 을 비우는 곳이다.
	- `update_ring` 에서 page 를 빼서 [[#histogram_update()]] 를 통해 해당 histogram bin 으로 넣어준다.

> [!tip] 코드 위치
> - [src/pebs.c:1030-1034](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L1030-L1034)

```c
if(smoothed_occ_local == beta * smoothed_occ_remote) {
	// nothing to do
	fprintf(colloid_log_f, "equal occupancy exit\n");
	goto out;
}
```

- 다음은 latency 가 일치하는지 확인한 다음, 같다면 migration 을 하지 않는다.
	- 여기서 `beta` 값은 `smoothed_inserts_local/smoothed_inserts_remote` 로 정의되고, 따라서 위 코드의 수식은 결국에는 latency 를 비교하는 것과 같다는 것을 알 수 있다.

> [!tip] 코드 위치
> - [src/pebs.c:1035-1036](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L1035-L1036)

```c
target_delta = fabs(smoothed_occ_local - beta * smoothed_occ_remote);
target_delta /= (smoothed_occ_local+smoothed_occ_remote);
```

- 그리고 $\Delta p$ 값을 계산하는데, 왜 이렇게 계산하는지는 이해되지 않는다. 이 부분에 대해서는 [[#`SCAN_AND_SORT` mode|뒤]] 에서 좀 더 살펴보자.

> [!tip] 코드 위치
> - [src/pebs.c:1037-1041](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L1037-L1041)

```c
total_accesses = 0;
for(int i = 0; i < MAX_HISTOGRAM_BINS; i++) {
	total_accesses += (i * dram_histogram_list[i].numentries);
	total_accesses += (i * nvm_histogram_list[i].numentries);
}
```

- 그리고 여기서 total access count 를 계산한다.
	- 각 histogram bin 에는 해당 histogram bin 의 index 와 access count 가 일치하는 page 들이 들어있기 때문에, index 와 bin 의 entry count 를 곱하여 총합하는 것으로 total access count 를 계산할 수 있다.
	- 다만 [[#histogram_update()]] 함수에서 알 수 있다시피, 만약에 access count 가 `MAX_HISTOGRAM_BINS` 를 넘어가게 되면 `MAX_HISTOGRAM_BINS - 1` 로 index 가 산정된다. 따라서 이런 방식은 일부 page 들에 대해 access count 가 누락된다는 점에서 다소 부정확할 수 있다.
		- 이 부분에 대해서는 만약에 "approx. total access count 를 구한다" 로 가정한다면 봐줄 수 있는 부분이니까 넘어가자.

> [!tip] 코드 위치
> - [src/pebs.c:1046-1071](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L1046-L1071)

```c
best_i = -1;
best_j = -1;
best_delta = 0.0;
for(int i = 0; i < MAX_HISTOGRAM_BINS; i++) {
	if(i > 0 && dram_histogram_list[i].numentries == 0) {
		continue;
	}
	for(int j = 0; j < MAX_HISTOGRAM_BINS; j++) {
		if(j > 0 && nvm_histogram_list[j].numentries == 0) {
			continue;
		}
		if(smoothed_occ_local > beta * smoothed_occ_remote && i <= j) {
			continue;
		}
		if(smoothed_occ_local < beta * smoothed_occ_remote && i >= j) {
			continue;
		}
		pi = ((double)i)/((double)total_accesses);
		pj = ((double)j)/((double)total_accesses);
		if(fabs(pi - pj) <= target_delta && fabs(pi-pj) > best_delta) {
			best_i = i;
			best_j = j;
			best_delta = fabs(pi - pj);
		}
	}
}
```

- 그리고 위 코드에서 migrate 할 page 의 bin 을 고르게 된다.
	- 보면 이중 for 문을 통해 두 tier 의 histogram bin 들을 순회하게 된다.
	- 여기서 주목할 것은 두 if 문이다:
		- `smoothed_occ_local > beta * smoothed_occ_remote && i <= j` 가 성립하면 `continue` 하므로, 만약 `smoothed_occ_local > beta * smoothed_occ_remote && i > j` 이라면 통과이다.
			- 이 말을 차근차근 뜯어보면 일단 `smoothed_occ_local > beta * smoothed_occ_remote` 라는 것은 default tier 의 latency 가 더 크다는 뜻이다.
			- 그리고 `i` 는 `dram_histogram_list` 에 대한 index 이고 `j` 는 `nvm_histogram_list` 에 대한 index 이기 때문에, 이 위의 조건이 맞을때는 `dram_histogram_list` 의 index 가 `nvm_histogram_list` 의 index 보다 더 크다.
			- 근데 index 가 크다는 말은 access count 가 더 큰 page 가 담긴 bin 을 선택한다는 것이다.
			- 따라서 정리해 보면 이 조건은 default tier 의 latency 가 더 크다면 default tier 에서는 access count 가 더 큰 page 가 담긴 bin 을 고르고, alternate tier 에서는 access count 가 더 작은 page 가 담긴 bin 을 고른다는 의미가 된다.
			- 즉, default tier 의 latency 를 줄여주기 위해 default tier 에서 access count 가 많은 page 를 골라 alternate tier 에서 access count 가 적은 page 와 교체해주겠다는 의미로 해석된다.
		- 마찬가지로 `smoothed_occ_local < beta * smoothed_occ_remote && i >= j` 가 성립하면 `continue` 하므로, `smoothed_occ_local < beta * smoothed_occ_remote && i < j` 이면 통과이다.
			- 위에서의 해석을 가져와 본다면 이 조건의 말 뜻은 default tier 의 latency 가 더 작다면 default tier 에서는 access count 가 더 작은 page 가 담긴 bin 을 고르고, alternate tier 에서는 access count 가 더 큰 page 가 담긴 bin 을 고른다는 의미가 된다.
			- 따라서 default tier 의 latency 를 늘려주기 위해 default tier 에서 access count 가 적은 page 를 골라 alternate tier 에서 access count 가 많은 page 와 교체해주겠다는 말뜻으로 해석할 수 있다.
	- 그리고 위 조건에 맞되, 가장 `target_delta` 와 근접한 `i` 와 `j` 를 계산하는 것이 그 아래의 코드이다.
- 이렇게 하여 default tier 의 어느 bin 에서 page 를 꺼낼지에 대한 index 인 `best_i` 와 alternate tier 의 어느 bin 에서 page 를 꺼낼지에 대한 index 인 `best_j` 를 특정하게 된다.

> [!tip] 코드 위치
> - [src/pebs.c:1083-1117](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L1083-L1117)

```c
if(best_i == 0) {
	// No point in swapping 0 freq page if there are free pages
	np = dequeue_fifo(&dram_free_list);
}
if(np == NULL) {
	p = dequeue_fifo(&dram_histogram_list[best_i]);
	if(p == NULL) {
		// should ideally not happen
		fprintf(colloid_log_f, "best_i empty exit\n");
		goto out;
	}
	#ifdef COOL_IN_PLACE
	if(p == cur_cool_in_dram) {
		// TODO: this seems a bit iffy; might cause background cooling to stall
		prev_page(&dram_histogram_list[0], NULL, &cur_cool_in_dram);
	}
	#endif
	np = dequeue_fifo(&nvm_free_list);
	assert(np != NULL);
	assert(!(np->present));
	old_offset = p->devdax_offset;
	pebs_migrate_down(p, np->devdax_offset);
	np->devdax_offset = old_offset;
	np->in_dram = true;
	np->present = false;
	np->hot = false;
	for (int i = 0; i < NPBUFTYPES; i++) {
		np->accesses[i] = 0;
		np->tot_accesses[i] = 0;
	}

	// Place the migated page into right nvm histogram bin
	histogram_update(p, p->accesses[DRAMREAD] + p->accesses[NVMREAD]);
	migrated_bytes += pt_to_pagesize(p->pt);
}
```

- 그리고 여기에서는 `best_i` 에서 page 를 하나 꺼내고, alternate tier 에서는 free page 를 하나 꺼내어 [pebs_migrate_down()](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L441-L462) 함수로 migration 을 시켜준다.

> [!tip] 코드 위치
> - [src/pebs.c:1121-1152](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L1121-L1152)

```c
// Move remote page to local
if(best_j > 0) {
	p = dequeue_fifo(&nvm_histogram_list[best_j]);
	if(p == NULL) {
		// should ideally not happen
		enqueue_fifo(&dram_free_list, np);
		fprintf(colloid_log_f, "best_j empty exit\n");
		goto out;
	}
	#ifdef COOL_IN_PLACE
	if(p == cur_cool_in_nvm) {
		// TODO: this seems a bit iffy; might cause background cooling to stall
		prev_page(&nvm_histogram_list[0], NULL, &cur_cool_in_nvm);
	}
	#endif
	assert(!(np->present));
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

	// Place the migated page into rigth nvm histogram bin
	histogram_update(p, p->accesses[DRAMREAD] + p->accesses[NVMREAD]);
	enqueue_fifo(&nvm_free_list, np);
	migrated_bytes += pt_to_pagesize(p->pt);
}
```

- 또한 여기에서는 `best_j` 에서 page 를 하나 꺼내고, default tier 에서는 free page 를 하나 꺼내어 [pebs_migrate_up()](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L464-L485) 으로 page migrate 를 하게 된다.
- 결과적으로 위의 두 코드로 인해 `best_i` 의 page 하나와 `best_j` 의 page 하나가 교체되는 것.

### `SCAN_AND_SORT` mode

- 지금까지의 코드는 `HISTOGRAM` mode 의 코드였는데, 논문에 나온 로직은 $\Delta p$ 를 구하는 로직은 여기에 등장한다.

> [!tip] 코드 위치
> - [src/pebs.c:1165-1172](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L1165-L1172)

```c
total_accesses = 0;
// Scan page lists and build frequency arrays
dram_freqs_count = 0;
nvm_freqs_count = 0;
dram_freqs_count += scan_page_list(&dram_hot_list, dram_page_freqs+dram_freqs_count, dramsize/PAGE_SIZE-dram_freqs_count, &total_accesses);
dram_freqs_count += scan_page_list(&dram_cold_list, dram_page_freqs+dram_freqs_count, dramsize/PAGE_SIZE-dram_freqs_count, &total_accesses);
nvm_freqs_count += scan_page_list(&nvm_hot_list, nvm_page_freqs+nvm_freqs_count, nvmsize/PAGE_SIZE-nvm_freqs_count, &total_accesses);
nvm_freqs_count += scan_page_list(&nvm_cold_list, nvm_page_freqs+nvm_freqs_count, nvmsize/PAGE_SIZE-nvm_freqs_count, &total_accesses);
```

- 일단 여기서는 histogram 을 사용하지 않고 원래 HeMem 에서처럼 hot, cold list 를 사용한다.
- 따라서 위 코드에서 보다시피 각 tier 의 hot, cold list 를 순회하며 total access count 를 계산한다.

> [!tip] 코드 위치
> - [src/pebs.c:1179-1181](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L1179-L1181)

```c
// Sort frequency arrays in increasing order
qsort(dram_page_freqs, dram_freqs_count, sizeof(struct page_freq), cmp_page_freq);
qsort(nvm_page_freqs, nvm_freqs_count, sizeof(struct page_freq), cmp_page_freq);
```

- 또한 histogram 이 없기 때문에 위 코드에서 page 들을 access count 순대로 별도로 정렬해주게 된다.

> [!tip] 코드 위치
> - [src/pebs.c:1190-1216](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L1190-L1216)

```c
if(fabs(smoothed_occ_local - beta * smoothed_occ_remote) < COLLOID_DELTA*smoothed_occ_local) {
	// We are within target; don't want to migrate anything
	target_delta = 0.0;
} else {
	cur_p = smoothed_inserts_local/(smoothed_inserts_local+smoothed_inserts_remote);
	if(smoothed_occ_local < beta * smoothed_occ_remote) {
		p_lo = cur_p;
		if(p_hi <= p_lo) {
			// reset p_hi
			p_hi = 1.0;
		}
	} else {
		p_hi = cur_p;
		if(p_lo >= p_hi) {
			// reset p_lo
			p_lo = 0.0;
		}
	}
	if(fabs(p_hi-p_lo) < COLLOID_EPSILON) {
		if(smoothed_occ_local < beta * smoothed_occ_remote) {
			p_hi = 1.0;
		} else {
			p_lo = 0.0;
		} 
	}
	target_delta = fabs((p_lo+p_hi)/2 - cur_p);
}
```

- 이 부분이 논문에 나온 logic 이다:
	- 저 `COLLOID_DELTA` 가 $\delta$ 로서 두 tier 의 latency 가 같은지 판단하고,
	- Binary search 를 하기 위한 upper bound 와 lower bound 인 `p_hi` 와 `p_lo` 를 설정해 주며
	- `COLLOID_EPSILON` 가 $\epsilon$ 으로서 $p^{*}$ 가 변경되었는지를 판단하고
	- `p_hi` 와 `p_lo` 의 중간값으로 `target_delta` 를 계산해주게 된다.

> [!tip] 코드 위치
> - [src/pebs.c:1278-1279](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L1278-L1279)

```c
for(migrated_bytes = 0; migrated_bytes < migrate_limit;) {
	// Find best pair of pages using two pointers
```

- 그리고 histogram mode 와는 다르게, 한번에 여러 page 들을 옮긴다.

> [!tip] 코드 위치
> - [src/pebs.c:1349](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L1349)

```c
target_delta -= best_delta;
```

- 또한 여러 page 들을 옮기기 떄문에, 한번 page 들을 옮길때 마다 `target_delta` 값을 감소시켜서 옮겨지는 page 들의 access probability 의 총합이 $\Delta p$ 가 되게 한다.

## histogram_update()

> [!tip] 코드 위치
> - [histogram_update()](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L509-L544)

- 이 함수에서는 page 를 access count 에 따라 histogram 에 넣어준다.

> [!tip] 코드 위치
> - [src/pebs.c:518-524](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L518-L524)

```c
// histogram_sync_page(page);
cur_list = page->list;
bin = accesses;
if(bin >= MAX_HISTOGRAM_BINS) {
	bin = MAX_HISTOGRAM_BINS - 1;
}
new_list = (page->in_dram)?(&dram_histogram_list[bin]):(&nvm_histogram_list[bin]);
```

- 우선 위의 코드가 page 가 들어갈 histogram bin 을 결정하는 곳인데
	- 보면 access count 에 해당하는 index 의 bin 에 들어가고
	- 만약 access count 가 `MAX_HISTOGRAM_BINS` 보다 크다면 마지막 bin 에 들어가는 것을 알 수 있다.
	- 그리고 이렇게 해서 현재 page 가 들어있는 bin (`cur_list`) 이랑, 새로 page 가 들어갈 bin (`new_list`) 을 결정한다.

> [!tip] 코드 위치
> - [src/pebs.c:526-541](https://github.com/webglider/hemem/blob/1b442e5758b14c557cfa06bbc93ba6cec0735387/src/pebs.c#L526-L541)

```c
if(cur_list != new_list) {
	if(cur_list != NULL) {
		page_list_remove_page(cur_list, page);
		ret = true;
		if(page->prev != NULL) {
			printf("page->prev not NULL after list remove");
			fflush(stdout);
		}
	}
	// page->local_histogram_clock = histogram_clock;
	if(page->prev != NULL) {
		printf("page->prev not NULL before enqueue\n");
		fflush(stdout);
	}
	enqueue_fifo(new_list, page);
}
```

- 그리고 위의 코드에서는 만약 `cur_list` 와 `new_list` 가 같지 않다면 `cur_list` 에서 page 를 빼서 `new_list` 에 넣어주는 작업을 한다.