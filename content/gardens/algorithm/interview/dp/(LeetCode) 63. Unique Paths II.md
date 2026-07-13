---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-07-12
aliases:
  - LeetCode 63
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/unique-paths-ii)

> [!tip] 요약
> - [[(LeetCode) 62. Unique Paths|LeetCode 62]] 와 같은 문제.

## 최종

> [!info]- 결과
> ![[Pasted image 20260712112016.png]]

- [[(LeetCode) 62. Unique Paths|LeetCode 62]] 와 같은 문제다.

```cpp
class Solution {
public:
	int uniquePathsWithObstacles(vector<vector<int>>& obstacleGrid) {
		auto &g = obstacleGrid; // Alias
		int m = g.size();
		int n = g[0].size();

		// Never
		if (g[0][0] || g[m - 1][n - 1]) {
			return 0;
		}

		// Top
		g[0][0] = 1;
		for (int ni = 1; ni < n; ni++) {
			g[0][ni] = g[0][ni] ? 0 : g[0][ni - 1];
		}

		// Inner
		for (int mi = 1; mi < m; mi++) {
			g[mi][0] = g[mi][0] ? 0 : g[mi - 1][0];

			for (int ni = 1; ni < n; ni++) {
				g[mi][ni] = g[mi][ni] ? 0 : g[mi][ni - 1] + g[mi - 1][ni];
			}
		}

		return g[m - 1][n - 1];
	}
};
```
