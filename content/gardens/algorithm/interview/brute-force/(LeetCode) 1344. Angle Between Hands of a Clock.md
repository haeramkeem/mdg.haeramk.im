---
tags:
  - mdg
  - algorithm
  - interview
  - brute-force
date: 2026-06-18
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/angle-between-hands-of-a-clock)

> [!tip] 요약
> - 그냥 생각나는대로 풀면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260618104600.png]]

- 그냥 0시 기준 각도를 각각 구한 후 적당히 처리해주면 된다.

```cpp
#define ABS_DIFF(a, b) ((a) > (b) ? (a) - (b) : (b) - (a))
#define MIN(a, b) ((a) < (b) ? (a) : (b))

class Solution {
public:
	double angleClock(int hour, int minutes) {
		double h_degree = 30 * (hour % 12) + 0.5 * minutes;
		double m_degree = 6 * minutes;
		double between = ABS_DIFF(h_degree, m_degree);

		return MIN(between, 360 - between);
	}
};
```
