---
tags:
  - mdg
  - algorithm
  - interview
  - bitwise
date: 2026-07-23
aliases:
  - LeetCode 3513
  - LeetCode 3513. Number of Unique XOR Triplets I
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/number-of-unique-xor-triplets-i)

> [!tip] 요약
> - 규칙찾기

## 최종

> [!info]- 결과
> ![[Pasted image 20260723201021.png]]

- 그냥 무지성으로 XOR 한번 했을때의 결과 쭉 적어보면 규칙성이 보인다.

```cpp
class Solution {
public:
	int uniqueXorTriplets(vector<int>& nums) {
		int n = nums.size();

		if (n < 3) {
			return n;
		}

		for (int i = 16; 0 < i; i--) {
			if ((n >> i) & 0x1) {
				return (1 << (i + 1));
			}
		}

		return 0;
	}
};
```
