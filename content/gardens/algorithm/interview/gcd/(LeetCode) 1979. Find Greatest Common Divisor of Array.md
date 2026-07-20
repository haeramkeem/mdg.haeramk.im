---
tags:
  - mdg
  - algorithm
  - interview
  - gcd
date: 2026-07-18
aliases:
  - LeetCode 1979
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/find-greatest-common-divisor-of-array)

> [!tip] 요약
> - 쉬운 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260718093147.png]]

- 그냥 [[Euclidean Algorithm (GCD)|유클리드 호제법]] 으로 구해주면 된다.

```cpp
class Solution {
	int getGCD(int a, int b) {
		while (b) {
			int rem = a % b;
			a = b;
			b = rem;
		}
		return a;
	}
public:
	int findGCD(vector<int>& nums) {
		int min_num = nums[0];
		int max_num = nums[0];

		for (int i = 1; i < nums.size(); i++) {
			min_num = min(min_num, nums[i]);
			max_num = max(max_num, nums[i]);
		}

		return getGCD(min_num, max_num);
	}
};
```
