---
tags:
  - mdg
  - algorithm
  - interview
  - grid
date: 2026-06-22
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/max-area-of-island)

> [!tip] 요약
> - BFS/DFS 로 풀면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260622150857.png]]

- BFS 혹은 DFS 로 풀면 된다. [[index|주인장]] 은 BFS 로 풀었다.

```cpp
#define MAX(a, b) ((a) > (b) ? (a) : (b))

class Solution {
	static constexpr int dir_delta[4][2] = {
		{1, 0}, {-1, 0}, {0, 1}, {0, -1},
	};
public:
	int maxAreaOfIsland(vector<vector<int>>& grid) {
		int m = grid.size();
		int n = grid[0].size();
		int max = 0;

		for (int mi = 0; mi < m; mi++) {
			for (int ni = 0; ni < n; ni++) {
				if (grid[mi][ni]) {
					queue<pair<int, int>> q;
					int cnt = 0;

					q.push({mi, ni});
					grid[mi][ni] = 0;

					while (!q.empty()) {
						auto cur = q.front();

						cnt++;

						for (int i = 0; i < 4; i++) {
							int m_next = cur.first + dir_delta[i][0];
							int n_next = cur.second + dir_delta[i][1];

							if (0 <= m_next && m_next < m && 0 <= n_next && n_next < n && grid[m_next][n_next]) {
								q.push({m_next, {n_next}});
								grid[m_next][n_next] = 0;
							}
						}

						q.pop();
					}

					max = MAX(max, cnt);
				}
			}
		}

		return max;
	}
};
```
