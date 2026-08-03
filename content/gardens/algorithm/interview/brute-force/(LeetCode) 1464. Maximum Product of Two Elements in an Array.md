---
tags:
  - mdg
  - algorithm
  - interview
  - brute-force
date: 2026-07-27
aliases:
  - LeetCode 1464
  - LeetCode 1464. Maximum Product of Two Elements in an Array
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/maximum-product-of-two-elements-in-an-array)

> [!tip] 요약
> - 쉬운 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260727221721.png]]

- [[(LeetCode) 628. Maximum Product of Three Numbers|LeetCode 628]] 와 사실상 같은 문제다. 그래서 똑같이 풀었다.

```cpp
class Solution {
public:
	int maxProduct(vector<int>& nums) {
		array<int, 2> top2{};

		for (int num : nums) {
			if (num > top2[0]) {
				top2[1] = top2[0];
				top2[0] = num;
			} else if (num > top2[1]) {
				top2[1] = num;
			}
		}

		return (top2[0] - 1) * (top2[1] - 1);
	}
};
```
