---
tags:
  - mdg
  - algorithm
  - interview
  - brute-force
date: 2026-08-07
aliases:
  - LeetCode 3345
  - LeetCode 3345. Smallest Divisible Digit Product I
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/smallest-divisible-digit-product-i)

> [!tip] 요약
> - 쉬운 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260807124014.png]]

- Testcase 가 작기 때문에 무지성으로 풀어도 된다. 그게 시간을 절약하는 길이다.

```cpp
class Solution {
	int product(int a) {
		int acc = 1;

		while (a) {
			acc *= a % 10;
			a /= 10;
		}

		return acc;
	}
public:
	int smallestNumber(int n, int t) {
		for (int i = n; 0 < i; i++) {
			if (product(i) % t == 0) {
				return i;
			}
		}

		// Should not happen
		return -1;
	}
};
```
