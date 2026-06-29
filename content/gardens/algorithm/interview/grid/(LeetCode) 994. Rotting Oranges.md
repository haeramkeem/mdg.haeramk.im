---
tags:
  - mdg
  - algorithm
  - interview
  - grid
date: 2026-06-22
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/rotting-oranges)

> [!tip] 요약
> - BFS 로 풀면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260622152756.png]]

- BFS 로 풀면 된다.

```cpp {26,33}
#define FRESH (1)
#define ROTTEN (2)

class Solution {
	static constexpr int dir_delta[4][2] = {
		{1, 0}, {-1, 0}, {0, 1}, {0, -1}
	};
public:
	int orangesRotting(vector<vector<int>>& grid) {
		int m = grid.size();
		int n = grid[0].size();
		queue<pair<int, int>> q;
		int min = 0;

		for (int mi = 0; mi < m; mi++) {
			for (int ni = 0; ni < n; ni++) {
				if (grid[mi][ni] == ROTTEN) {
					q.push({mi, ni});
				}
			}
		}

		while (!q.empty()) {
			auto cur = q.front();

			min = grid[cur.first][cur.second] - 2;

			for (int i = 0; i < 4; i++) {
				int next_m = cur.first + dir_delta[i][0];
				int next_n = cur.second + dir_delta[i][1];

				if (0 <= next_m && next_m < m && 0 <= next_n && next_n < n && grid[next_m][next_n] == FRESH) {
					grid[next_m][next_n] = grid[cur.first][cur.second] + 1;
					q.push({next_m, next_n});
				}
			}

			q.pop();
		}

		for (int mi = 0; mi < m; mi++) {
			for (int ni = 0; ni < n; ni++) {
				if (grid[mi][ni] == FRESH) {
					return -1;
				}
			}
		}

		return min;
	}
};
```

- 한가지 신경쓴 것은
	- `L26`, `L33`: Grid 의 값을 minute 로 사용했다. 즉, 썩은 오렌지를 나타내는 `2` 는 0분, 1분이 지나서 썩은 오렌지는 `3` 으로 표기된다.