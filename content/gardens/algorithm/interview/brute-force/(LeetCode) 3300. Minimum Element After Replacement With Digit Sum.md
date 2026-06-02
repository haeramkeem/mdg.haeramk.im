---
tags:
  - mdg
  - algorithm
  - interview
  - brute-force
date: 2026-05-29
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/minimum-element-after-replacement-with-digit-sum)

> [!tip] 요약
> - 하라는대로 하면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260529094747.png]]

- 이걸 brute-force 로 분류하는게 맞나 싶긴 하지만, 어쨋든 하라는대로 하면 풀린다.

```cpp
#define MAX_I32 (0x7FFFFFFF)
#define MIN(a, b) ((a) < (b) ? (a) : (b))

class Solution {
	int calcSum(int target) {
		int ret = 0;

		while (target) {
			ret += target % 10;
			target /= 10;
		}

		return ret;
	}
public:
	int minElement(vector<int>& nums) {
		int min = MAX_I32;

		for (auto num : nums) {
			min = MIN(min, calcSum(num));
		}

		return min;
	}
};
```
