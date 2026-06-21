---
tags:
  - mdg
  - algorithm
  - sort
  - terms
date: 2026-06-21
aliases:
  - Counting Sort
---
## TL;DR

> [!info] 이 TL;DR 이 이해가 안된다면, 아래 [[#레전드 친절한 설명|레전드 친절한 설명]] 을 보시라.

- Counting sort 는 최대값이 크지 않을 때 효율적인 방법이다.
- 네가지만 기억해라:
	1) 최대값 구해서 `최대값 + 1` 의 크기를 갖는 counting array 만들어라
	2) 원본 array 순회하며 counting array 에 counting 해라
	3) Counting array 를 누적해라
	4) 그놈을 sorted array 의 index map 으로 사용해라. 다만, 한번 원소를 sorted array 에 배치한 후에는 해당하는 counting array 의 원소를 1 감소시켜라.

```cpp
vector<int> countingSort(const vector<int> &arg) {
	// 1. Get max
	int max = 0x80000000;
	for (int a : arg) {
		max = max > a ? max : a;
	}

	// 2. Get counting array
	vector<int> counting_arr(max + 1, 0);
	for (int a : arg) {
		counting_arr[a]++;
	}

	// 3. Accumulate
	for (int i = 1; i < max + 1; i++) {
		counting_arr[i] += counting_arr[i - 1];
	}

	// 4. Use counting array as index map
	vector<int> sorted(arg.size());
	for (int a : arg) {
		// 4-1. Decrease counting array elem by 1
		counting_arr[a]--;
		sorted[counting_arr[a]] = a;
	}

	return sorted;
}
```

## 레전드 친절한 설명

> [!warning]- 본 글은 #draft 상태입니다.
> - [ ] 그림 추가
> - [ ] 예제 코드 추가