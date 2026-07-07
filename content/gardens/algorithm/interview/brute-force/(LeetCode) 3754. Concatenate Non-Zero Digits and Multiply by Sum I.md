---
tags:
  - mdg
  - algorithm
  - interview
  - brute-force
date: 2026-07-07
aliases:
  - LeetCode 3754
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/concatenate-non-zero-digits-and-multiply-by-sum-i)

> [!tip] 요약
> - 쉬운문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260707091914.png]]

- 생각나는대로 풀면 풀린다.

```cpp
#define LL(a) ((long long)(a))

class Solution {
public:
	long long sumAndMultiply(int n) {
		int x = 0;
		int sum = 0;

		while (n) {
			int digit = n % 10;
			if (digit) {
				x = x * 10 + digit;
				sum += digit;
			}
			n /= 10;
		}

		// Reverse
		n = x;
		x = 0;
		while (n) {
			x = x * 10 + (n % 10);
			n /= 10;
		}

		return LL(x) * LL(sum);
	}
};
```
