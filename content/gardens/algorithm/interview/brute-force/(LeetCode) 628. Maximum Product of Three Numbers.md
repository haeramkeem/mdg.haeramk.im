---
tags:
  - mdg
  - algorithm
  - interview
  - brute-force
date: 2026-07-26
aliases:
  - LeetCode 628
  - LeetCode 628. Maximum Product of Three Numbers
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/maximum-product-of-three-numbers)

> [!tip] 요약
> - 쉬운 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260726100048.png]]

- [[(LeetCode) 3536. Maximum Product of Two Digits|LeetCode 3536]] 처럼 histogram 쓸까 했는데, 그냥 최대3개/최소2개 골라내서 풀었다.
	- 최소 2개를 골라야 하는 이유는 음수가 가능하기 때문이다.

```cpp
class Solution {
public:
	int maximumProduct(vector<int>& nums) {
		array<int, 3> max_3{-1001, -1001, -1001};
		array<int, 2> min_2{1001, 1001};

		for (int num : nums) {
			if (max_3[0] < num) {
				max_3[2] = max_3[1];
				max_3[1] = max_3[0];
				max_3[0] = num;
			} else if (max_3[1] < num) {
				max_3[2] = max_3[1];
				max_3[1] = num;
			} else if (max_3[2] < num) {
				max_3[2] = num;
			}

			if (min_2[0] > num) {
				min_2[1] = min_2[0];
				min_2[0] = num;
			} else if (min_2[1] > num) {
				min_2[1] = num;
			}
		}

		return max(max_3[0] * max_3[1] * max_3[2], max_3[0] * min_2[0] * min_2[1]);
	}
};
```
