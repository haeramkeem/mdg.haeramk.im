---
tags:
  - mdg
  - algorithm
  - interview
  - binary-search
date: 2026-07-02
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/sqrtx)

> [!tip] 요약
> - 그냥 binary search 하면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260702101754.png]]

- 제곱근을 구하는 알고리즘은 여러가지가 있지만, 이 문제처럼 정수 정답을 찾아야 하고 코테에 맞는 수준의 알고리즘은 그냥 binary search 하는 것이다.

```cpp
#define uint unsigned int

class Solution {
public:
	int mySqrt(int x) {
		uint l = 0;
		uint r = (1U << 31) - 1;

		while (l + 1 < r) {
			uint m = (l + r) >> 1;
			uint p = m * m;

			if (x < p) {
				r = m;
			} else if (p < x) {
				l = m;
			} else /* (p == x) */ {
				return m;
			}
		}

		return l;
	}
};
```
