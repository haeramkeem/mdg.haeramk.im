---
tags:
  - mdg
  - algorithm
  - interview
  - sort
date: 2026-04-17
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/minimum-distance-between-three-equal-elements-i)

> [!tip] 요약
> - 쉬운 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260417085125.png]]

- `num[i]`, `i` 순서로 정렬한 뒤 앞에서부터 순회하며 연속된 세 원소의 number가 같을 때의 index 차이를 구해주면 된다.

```cpp
#define u32 unsigned int
#define MAX_U32 (0xFFFFFFFF)

#define MIN(a, b) ((a) < (b) ? (a) : (b))
#define DISTANCE(a, b, c) (((b) - (a)) + ((c) - (b)) + ((c) - (a)))

#define PACK(idx, num) (((idx) << 16) | ((num) & 0xFFFF))
#define UNPACK_IDX(pack) (((pack) >> 16) & 0xFFFF)
#define UNPACK_NUM(pack) ((pack) & 0xFFFF)

class Solution {
public:
	int minimumDistance(vector<int>& nums) {
		u32 min = MAX_U32;

		for (int i = 0; i < nums.size(); i++) {
			nums[i] = PACK(i, nums[i]);
		}

		sort(nums.begin(), nums.end(), [](auto a, auto b) {
			return UNPACK_NUM(a) != UNPACK_NUM(b) ? UNPACK_NUM(a) < UNPACK_NUM(b) : UNPACK_IDX(a) < UNPACK_IDX(b);
		});

		for (int i = 0; i + 2 < nums.size(); i++) {
			if (UNPACK_NUM(nums[i]) == UNPACK_NUM(nums[i + 1]) && UNPACK_NUM(nums[i + 1]) == UNPACK_NUM(nums[i + 2])) {
				min = MIN(min, DISTANCE(UNPACK_IDX(nums[i]), UNPACK_IDX(nums[i + 1]), UNPACK_IDX(nums[i + 2])));
			}
		}

		return min;
	}
};
```

## 다른 풀이 (C++)

> [!info]- 결과
> ![[Pasted image 20260417084800.png]]

> [!info]- 코드
> ```cpp
> #define u32 unsigned int
> #define MAX_U32 (0xFFFFFFFF)
>
> #define MIN(a, b) ((a) < (b) ? (a) : (b))
> #define DISTANCE(a, b, c) (((b) - (a)) + ((c) - (b)) + ((c) - (a)))
>
> class Solution {
> public:
> 	int minimumDistance(vector<int>& nums) {
> 		map<int, vector<int>> num_to_idx;
> 		u32 min = MAX_U32;
>
> 		for (int i = 0; i < nums.size(); i++) {
> 			num_to_idx[nums[i]].push_back(i);
> 		}
>
> 		for (auto &p : num_to_idx) {
> 			auto &idxs = p.second;
>
> 			for (int i = 0; i + 2 < idxs.size(); i++) {
> 				min = MIN(min, DISTANCE(idxs[i], idxs[i + 1], idxs[i + 2]));
> 			}
> 		}
>
> 		return min;
> 	}
> };
> ```

- Sort 하는거랑 시간복잡도는 동일하긴 한데, 이렇게 `map` 을 사용해서 풀 수도 있다.