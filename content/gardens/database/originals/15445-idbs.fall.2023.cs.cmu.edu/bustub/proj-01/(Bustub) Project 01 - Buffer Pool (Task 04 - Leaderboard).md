---
tags:
  - CMU-15445
  - database
  - bustub
date: 2024-07-15
---
> [!info]- 참고한 것들
> - [가이드](https://15445.courses.cs.cmu.edu/fall2023/project1/)

> [!info]- CodeRef (인데 private 이라 주인장만 볼 수 있음)
> - [Github PR08](https://github.com/haeramkeem/bustub-private.idbs.fall.2023.cs.cmu.edu/pull/8)

> [!warning] 현재는 정확한 기능 구현에만 초점이 맞춰져 있고, 시간관계상 최적화는 고려하지 않았습니다.

## Thread-safe !

- 벤치마크를 돌려 성능 최적화까지 하면 더 좋겠지만, 일단은 여기에 너무 많은 시간을 투자했으니 thread-safe 까지만 구현해주고 종료하는 것으로 하자.

### `LRUKReplacer` ([[(Bustub) Project 01 - Buffer Pool (Task 01)|*]])

- 이놈의 경우에는 `LRUKReplacer::node_store_` 를 보호하는 것이 가장 중요했는데,
- 근데 모든 public member function 에서 이놈을 수정하고 있어 그냥 큰 고민 없이 `std::unique_lock` 으로 각 함수의 수명주기와 같이 가는 lock 을 걸어주었다.
- 그리고 필수적이지는 않지만 `LRUKReplacer::current_timestamp_` 와 `LRUKReplacer::curr_size` 와 같은 counter 들을 `std::atomic` 으로 변경하였다.

### `BufferPoolManager` ([[(Bustub) Project 01 - Buffer Pool (Task 03)|*]])

- 이놈도 보호해야 할 private member field 들은 다음 세 가지 (`BufferPoolManager::pages_`, `BufferPoolManager::page_table_`, `BufferPoolManager::free_list_`) 정도 있는데,
- [[#`LRUKReplacer` ( (Bustub) Project 01 - Buffer Pool (Task 01) * )|LRUKReplacer]] 에서와 마찬가지로 모든 public member function 에서 이놈을 수정하고 있어 그냥 큰 고민 없이 `std::unique_lock` 으로 각 함수의 수명주기와 같이 가는 lock 을 걸어주었다.
- Private member function 의 경우에는 caller function 에서 lock 을 획득하고 들어왔을 것이라는 가정 하에, 별도로 lock 을 걸지는 않고 `BUSTUB_ASSERT()` 와 `std::mutex::try_lock()` 으로 lock 이 이미 걸려있나만 검증했다.
- 마지막으로 `Page` 에 대한 lock 도 추가적으로 고려되었다.
	- `Page` class 에는 data read 에 사용할 read lock (`Page::RLatch()`, `Page::RUnlatch()`) 과 data write 에 사용할 write lock (`Page::WLatch()`, `Page::WUnlatch()`) 가 기본 제공된다.
	- 그리고 이 `Page` 객체는 여러 client 가 직접 붙어서 사용하기에, BPM 에서도 이놈을 수정하기 위해 lock 을 걸어주는 것이 안전하다고 판단했다.
	- 그래서, `DiskScheduler` 로 disk 에서 data 를 읽어와 메모리에 로드하는 경우와 메모리 공간을 초기화하는 경우에는 write lock 을, 메모리의 data 를 disk 에 내리는 경우에는 read lock 을 걸도록 변경하였다.

### `page seed not consistent` 에러

- 여기까지 하고 벤치마크를 돌려 보면, 다음과 같은 에러가 난다.

```
[info] total_page=6400, duration_ms=30000, latency=0, lru_k_size=16, bpm_size=64, scan_thread_cnt=8, get_thread_cnt=8
[info] benchmark start
page header not consistent: page_id_=0 page_idx=2
Stack trace (most recent call last) in thread 6112686080:
...
```

- `bpm_bench` 에서는 scan thread 에서 `seed` 값을 증가시키며 write 를 하고, get thread 에서는 그냥 read 만 하는데, ([참고](https://github.com/cmu-db/bustub/blob/master/tools/bpm_bench/bpm_bench.cpp#L247-L252))
- 에러를 가만 보아 하니 변경된 `seed` 가 제대로 반영되지 않아 발생하는 문제인 것으로 보였다.

#### 핵심 디버깅

- 긴 시간의 삽질이 있었지만, 문제 해결에 직접적인 영향을 준 디버깅 과정만 정리해 보자.
- 일단 page 한놈만 조지는 것이 아이디어이다.
	- 기본 설정되는 page 수가 6400 개이기에 이것에 대해 전부 로그를 찍기보다는 각 함수에다가 `page_id == 0` 일때만 로그를 찍어 어떤 일이 일어나는 지 확인하는 것.
	- 원래는 저 에러가 나면 DB 가 종료되지만 `page_id == 0` 일 때만 종료되도록 수정하여 그놈만 조저보았다.
- 그랬더니 심히 이상한 것을 발견하였다:

```
### [modify] seed_=6 => seed=7
### [unpin-] thread_id=0
### [unpin-] thread_id=100
### [unpin-] thread_id=102
### [evictd]
### [is---W] (false)
```

- 이것이 뭔 상황이냐:
	1) `seed` 가 `6` 에서 `7` 로 변경된다.
	2) 그리고 `0` 번 scan thread 가 unpin 하고,
	3) 곧이어 `0`, `2` 번 get thread 가 unpin 하였다.
		- `100`, `102` 라고 된 것은 thread 가 scan 인지 get 인지 구별하기 위해 get thread 에다만 `thread_id` 에 100을 더해서 출력했기 때문이다.
	4) 그리고 page 가 evict 되는데
	5) 이때 `Page::is_dirty_` 플래그가 꺼져있었던 것.
- 당연히 말이 안되는 상황이다; `seed` 가 변경되었기 때문에 `Page::is_dirty_` 는 당연히 켜져있어야 하는데, 꺼져 있었고 따라서 evict 할 때 데이터가 flush 되지 않은 것이다.

#### 문제 해결

- 문제는 `BufferPoolManager::UnpinPage()` 의 구현에 있었다.
- 주인장은 아무 생각 없이 인자로 받은 `is_dirty` 값을 그대로 `Page::is_dirty_` 에 집어 넣었는데, 이렇게 하면 scan thread 가 dirtiness 를 `true` 로 해서 unpin 하더라도 get thread 가 이후에 `false` 로 하여 unpin 하게 되면 당연히 플래그가 꺼지기 때문.
- 따라서 기존의 dirtiness 와 인자로 받은 dirtiness 를 `OR` 연산해 둘 중 하나라도 참이면 dirtiness 가 켜져 있도록 했다.

## C++ 관련 삽질

- [[Atomic 자료형 (C++ Concurrency)]]
- [[Lock guard (C++ Concurrency)]]
- [[Lock 함수 (C++ Concurrency)]]
- [[Unique lock (C++ Concurrency)]]
- [[Shared mutex (C++ Concurrency)]]