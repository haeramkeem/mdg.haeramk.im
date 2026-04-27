---
tags:
  - mdg
  - algorithm
  - interview
  - brute-force
date: 2026-04-20
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/mirror-distance-of-an-integer)

> [!tip] 요약
> - 하라는대로 하면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260420134230.png]]

- 이걸 brute-force 로 분류하는게 맞나 싶긴 하지만, 어쨋든 하라는대로 하면 풀린다.

```cpp
#define ABS_DIFF(a, b) ((a) > (b) ? (a) - (b) : (b) - (a))

class Solution {
public:
	int mirrorDistance(int n) {
		int rem = n;
		int rev = 0;

		if (n < 10) {
			return 0;
		}

		while (rem) {
			rev = (rev * 10) + (rem % 10);
			rem /= 10;
		}
		
		return ABS_DIFF(n, rev);
	}
};
```