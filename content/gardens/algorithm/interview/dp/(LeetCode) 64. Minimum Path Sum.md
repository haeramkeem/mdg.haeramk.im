---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-07-12
aliases:
  - LeetCode 64
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/minimum-path-sum)

> [!tip] 요약
> - [[(LeetCode) 62. Unique Paths|LeetCode 62]] 와 같은 문제.

## 최종

> [!info]- 결과
> ![[Pasted image 20260712113113.png]]

- [[(LeetCode) 62. Unique Paths|LeetCode 62]] 와 같은 문제다.

```cpp
class Solution {
public:
	int minPathSum(vector<vector<int>>& grid) {
		int m = grid.size();
		int n = grid[0].size();

		for (int ni = 1; ni < n; ni++) {
			grid[0][ni] += grid[0][ni - 1];
		}

		for (int mi = 1; mi < m; mi++) {
			grid[mi][0] += grid[mi - 1][0];

			for (int ni = 1; ni < n; ni++) {
				grid[mi][ni] += min(grid[mi - 1][ni], grid[mi][ni - 1]);
			}
		}

		return grid[m - 1][n - 1];
	}
};
```
