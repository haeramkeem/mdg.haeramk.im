---
tags:
  - mdg
  - algorithm
  - interview
  - mapset
date: 2026-04-17
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/minimum-absolute-distance-between-mirror-pairs)

> [!tip] 요약
> - 문제를 잘 읽자.

## 최종

> [!info]- 결과
> ![[Pasted image 20260417092700.png]]

- 문제를 읽어보면, `i < j` 일때의 `reverse(nums[i]) == nums[j]` 를 찾는 것이다. 즉, reverse 하는 놈의 index 가 작아야 한다.
- `map` 을 이용해 reverse 된 값에 대한 가장 마지막의 index 를 추적하면, 새로운 index 에 대해 이놈의 reverse 에 대한 마지막 index 를 `map` 을 통해 얻을 수 있다.
- 이렇게 그 둘 간의 index 차이의 최소를 구해주면 되는 것.

```cpp
#define u32 unsigned int
#define MAX_U32 (0xFFFFFFFF)

#define MIN(a, b) ((a) < (b) ? (a) : (b))

class Solution {
	int reverse(int num) {
		int acc = 0;

		while (num) {
			acc = (acc * 10) + (num % 10);
			num /= 10;
		}

		return acc;
	}
public:
	int minMirrorPairDistance(vector<int>& nums) {
		map<int, int> rev_idx;
		u32 min = MAX_U32;

		for (int i = 0; i < nums.size(); i++) {
			if (rev_idx.find(nums[i]) != rev_idx.end()) {
				min = MIN(min, i - rev_idx[nums[i]]);
			}

			rev_idx[reverse(nums[i])] = i;
		}

		return min;
	}
};
```
