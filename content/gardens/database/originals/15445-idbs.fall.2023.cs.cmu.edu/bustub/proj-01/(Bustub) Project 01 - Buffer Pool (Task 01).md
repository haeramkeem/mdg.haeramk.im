---
tags:
  - CMU-15445
  - Database
  - Bustub
date: 2024-07-08
---
> [!info]- 참고한 것들
> - [가이드](https://15445.courses.cs.cmu.edu/fall2023/project1/)

> [!info]- CodeRef (인데 private 이라 주인장만 볼 수 있음)
> - [Github PR05](https://github.com/haeramkeem/bustub-private.idbs.fall.2023.cs.cmu.edu/pull/5)

> [!warning]- 이 task 의 구현은 이후에 부분적으로 변경되었습니다.
> - [[(Bustub) Project 01 - Buffer Pool (Task 04 - Leaderboard)|Thread-safe]]

## Design and Implementation of LRU-K Replacement Algorithm

- LRU-K RA 는 *Backward K-Distance* (너무 기니까 줄여서 *BKD* 라고 부르자) 가 최대가 되는 frame 을 방출하는 것이다.
- 이때 *BKD* 는 어떤 frame 에 대한 $K$ 지난 번째 접근에의 timestamp 와 현재 timestamp 간의 차이를 의미한다.
	- 즉, 오래된 순서로 $K$ 번째가 아닌, 최근순으로 $K$ 번째인 것.
- 여기서 몇가지 조건이 달린다.
	- 만약 어떤 frame 이 $K$ 번 접근되지 않아 $K$ 번째가 없다면, *BKD* 는 양의 무한대가 된다.
	- 만약 *BKD* 값이 양의 무한대가 되는 frame 이 여러개 있을 때에는, LRU-K 가 아닌 LRU 로 작동하게 해야 한다.
	- Victim 으로 선정된 frame 은 evictable 해야 한다. 즉, evictable 플래그가 꺼져 있는 frame 은 victim 선정 과정에서 제외된다.
- 이제 이 상황에서의 DI (Design and Implementation) 을 정리해 보자.

### Overview

- 전체적으로는 wrapper class 인 `LRUKReplacer` 와 이놈이 관리하는 frame 들을 추상화한 class 인 `LRUKNode` 로 구성된다.
- 이 class 들을 하나하나 뜯어보자.

### `LRUKNode` 의 Private field 분석

- `LRUKNode` 의 public method 들은 그냥 helper func 들일 뿐이고, private field 만 좀 확인해 보자.
- `std::deque<size_t> history_`: 해당 frame 의 access timestamp 를 저장할 deque 이다.
	- 원래의 code template 에는 `std::list` 로 제공된다. 하지만 random access 를 하고싶어서 `std::deque` 로 변경했다.
	- 어떤 frame 에 대한 접근 시간을 deque 에 `push_front` 하고
	- *BKD* 를 구할 때에는 $K$ 번째 원소 (즉, index `[k - 1]`) 에 접근하면 되게끔
- `bool is_evictable_{false}`: Evictable 플래그

### `LRUKReplacer` 의 Private field 들 분석

- `std::unordered_map<frame_id_t, LRUKNode> node_store_`: 딱 봐도 `frame_id` 로 `LRUKNode` 를 얻어내기 위한 map 인 것으로 보인다.
- `size_t current_timestamp_`: 현재의 timestamp 를 기록하는 필드이다. 다만,
	- 초기값은 `0` 이 아니라 `1` 로 주었다.
		- 왜냐면 *BKD* 가 최대가 되기 위해서는 access timestamp 가 최소가 되어야 하고, $K$ 번째 timestamp 가 없는 경우에는 *BKD* 가 양의 무한대로 최대가 되어야 하기 때문에 timestamp 는 최소가 되어야 한다.
		- 따라서 timestamp `0` 을 reserve 해 양의 무한대의 *BKD* 에 대한 timestamp 에 대응하게 했다.
	- 이 값은 frame access 시에 증가한다. 즉, `LRUKReplacer::RecordAccess` 호출시에 증가하게 된다.
- `size_t curr_size_`: 현재 replacer 의 사이즈이고,
- `size_t replacer_size_`: 이건 replacer 의 최대 사이즈이다.
	- 위 `curr_size_` 와 `replacer_size_` 의 차이는 evictable 이다.
	- `replacer_size_` 은 말 그대로 replacer 의 최대 크기로, 관리하는 모든 frame 의 개수를 의미한다.
	- `curr_size_` 은 replacer 의 frame 중에서, evictable count 를 의미한다.
		- 따라서 0과 `replacer_size_` 사이의 값이어야 한다.
- `size_t k_`: $K$ 값.

### `LRUKReplacer::Size`

- 이게 제일 쉽다. 그냥 `curr_size_` 값을 반환해주면 된다.

### `LRUKReplacer::SetEvictable`

- 이것도 별거 없다. 인자로 들어온 `frame_id` 로 frame 을 찾아 evictable 플래그를 설정해주고, 플래그가 어떻게 바뀌었냐에 따라서 `curr_size_` 만 조정해주면 된다.
- 다만 frame 을 못찾으면 별다른 exception 없이 바로 함수를 종료하는 정도의 예외처리만 해줬다.

### `LRUKReplacer::Remove`

- 얘는 인자로 받은 `frame_id` 에 대한 frame 을 삭제하는 놈이다.
- 다만 `LRUKReplacer::Evict` 와의 차이점은 victim 선정을 하지 않는다는 것이다.
	- 따라서 얘를 구현해 놓고 나중에 `LRUKReplacer::Evict` 에서는 victim 선정을 한 다음에 얘를 호출해서 frame 을 삭제해주면 된다.
- 여기서 수행하는 작업은:
	1. 해당 frame 에 대한 access history 를 초기화하고
	2. `node_store_` map 에서 이놈을 삭제하고
	3. `curr_size_` 를 감소시킨다.
- 아래 두 가지 정도의 예외처리가 들어갔다:
	1. Frame 을 못찾으면 그냥 바로 반환한다.
	2. Frame 이 evictable 하지 않으면 exception 을 던진다.

### `LRUKReplacer::RecordAccess`

- Frame 에 대한 access history 를 추가하는 함수이다.
- 하는 일은 별거 없다:
	- `current_timestamp_` 값을 증가시키고
	- Frame 의 history 에 이 값을 append 해준다.
- 간단한 예외처리는:
	- 만약 frame 이 없다면 새로 생성하여 `node_store_` 에 추가한다.
	- 그리고 새로 `LRUKNode` 를 생성하여 `node_store_` 에 추가해야 할 때는, `node_store_` 의 크기가 `replacer_size_` 를 넘지 않도록 한다.

### `LRUKReplacer::Evict`

- 대망의 Evict. 이놈이 제일 어려웠다.
- 우선 시간복잡도의 측면에서 짚고 가야 할 것이 있다.
	- 일단 LRU-K 알고리즘은 $O(logN)$ 의 시간복잡도를 가진다고 알려져 있다.
		- 물론 LRU-2 의 경우에는 이것을 최적화해 $O(1)$ 로 만든 2Q 가 있지만 어쨋든.
	- 근데 일단 PoC 를 위해 최적화는 나중에 하기로 하고 $O(N)$ 으로 구현했다.
- 기본적인 구조는 그냥 $O(N)$ 으로 최소값 찾는 알고리즘이다:
	- 만약에 frame 이 evictable 하지 않으면 그냥 지나치고
	- $K$ 번째 timestamp 가 더 작은 frame 이 있으면 그 frame 으로 victim 을 업데이트해준다.
- 여기서 추가적으로 고려된 것은 LRU-K <-> LRU 간의 전환이다.
	- 일단 victim 을 LRU-K 와 LRU 모두에 대해 선정한다.
	- 그리고 flag 를 두개를 두어 infinite BKD 가 등장하면 flag 하나를 키고, 이것이 또 등장하면 나머지 하나를 켜 두번째 flag 가 켜져있을 때에는 LRU 의 victim 을, 아닐 때는 LRU-K 의 victim 을 최종 victim 으로 삼는다.
- 이 함수가 실패하는 경우 (`false` 를 반환하는 경우) evict 할 frame 이 없는 경우인데, 이것은 다음의 방법으로 감지된다.
	- 보통 최소값 알고리즘의 경우에는 iteration 의 첫번째 값을 이용해 victim variable 을 초기화한다.
	- 하지만 현재 상황같은 경우에는 모든 frame 이 evictable 하지 않을 수 있기 때문에, 이 방법을 사용하면 iteration 이 종료되었을 때 초기화한 첫번째 값이 그대로 들어있어 이놈이 evict 된다.
	- 이것을 방지하기 위해 `std::map.end()` 값으로 초기화를 했으며, iteration 이후에 이 값이 그대로 있다면 evict target 을 찾지 못한 것이기 때문에 이때 `false` 를 반환하고 함수를 종료한다.
	- 이 방법으로 map 에 아무런 원소도 없는 경우에 대해서도 방어가 가능하다.
- 이 함수는 인자로 `frame_id` 에 대한 "포인터"를 받게 되어 있어 처음에 살짝 헷갈렸다.
	- 이 함수는 boolean 을 반환해 evict 성공, 실패 여부를 알려주고
	- 어떤 frame 이 evict 되었는지 이 포인터로 알려주게 된 구조이다.
- 따라서 victim 선정 후에는
	- 인자의 포인터가 가리키는 곳의 값을 변경해 주고
	- `LRUKReplacer::Remove` 함수를 호출해 frame 을 삭제해 준다.
		- 여기에서 `LRUKReplacer::Remove` 함수가 무조건 정상적으로 작동할 것이 전제로 깔려 있다.
		- 왜냐면 일단 frame 을 찾아서 인자로 넘겨주었기 때문에 `LRUKReplacer::Remove` 에서 해당 frame 을 찾지 못하는 경우는 없을 것이기 때문이고,
		- Evictable frame 에 대해서 victim 선정을 했기 때문에 `LRUKReplacer::Remove` 함수에서 non-evictable exception 이 발생하지도 않을 것이기 때문이다.