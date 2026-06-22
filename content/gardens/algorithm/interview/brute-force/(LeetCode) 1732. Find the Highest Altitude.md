---
tags:
  - mdg
  - algorithm
  - interview
  - brute-force
date: 2026-06-19
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/find-the-highest-altitude)

> [!tip] 요약
> - 쉬운 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260619100512.png]]

- 그냥 누적만 하면 된다.

```cpp
#define MAX(a, b) ((a) > (b) ? (a) : (b))

class Solution {
public:
	int largestAltitude(vector<int>& gain) {
		int max = 0;
		int cur = 0;

		for (int g : gain) {
			cur += g;
			max = MAX(max, cur);
		}

		return max;
	}
};
```

- 다만 조심할 것은 시작점의 고도가 `0` 이라는 것. 그니까 최고 고도는 무조건 `0` 이상이다.
