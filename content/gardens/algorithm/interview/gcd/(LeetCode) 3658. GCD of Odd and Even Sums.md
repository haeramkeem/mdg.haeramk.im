---
tags:
  - mdg
  - algorithm
  - interview
  - gcd
date: 2026-07-15
aliases:
  - LeetCode 3658
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/gcd-of-odd-and-even-sums)

> [!tip] 요약
> - 쉬운 문제.

## 최종

> [!info]- 결과
> ![[Pasted image 20260715092322.png]]

- [[Euclidean Algorithm (GCD)|유클리드 호제법]] 으로 풀어주면 된다.

```cpp
class Solution {
	// AS: Arithmetic Sequence
	int getSumAS(int initial, int common_diff, int n) {
		return n * initial + common_diff * n * (n - 1) / 2;
	}

	int getGCD(int a, int b) {
		while (b) {
			int rem = a % b;
			a = b;
			b = rem;
		}
		return a;
	}
public:
	int gcdOfOddEvenSums(int n) {
		return getGCD(getSumAS(1, 2, n), getSumAS(2, 2, n));
	}
};
```
