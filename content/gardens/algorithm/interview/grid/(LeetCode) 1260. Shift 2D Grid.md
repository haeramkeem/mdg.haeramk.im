---
tags:
  - mdg
  - algorithm
  - interview
  - grid
date: 2026-07-20
aliases:
  - LeetCode 1260
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/shift-2d-grid)

> [!tip] 요약
> - Flatten 하면 되는 쉬운 문제.

## 최종

> [!info]- 결과
> ![[Pasted image 20260720141029.png]]

- Flatten 하면 되는 쉬운 문제다.
	- In-place 로 하고싶지만 그럼 너무 logic 복잡해질거같아서 그냥 결과 `vector` 할당해서 풀었다.

```cpp
#define FLAT(cols, r, c) ((r) * (cols) + (c))
#define SHIFT(flat, cnt, total) (((flat) + (cnt)) % (total))
#define GRID_R(cols, idx) ((idx) / (cols))
#define GRID_C(cols, idx) ((idx) % (cols))

class Solution {
public:
	vector<vector<int>> shiftGrid(vector<vector<int>>& grid, int k) {
		int rows = grid.size();
		int cols = grid[0].size();
		vector<vector<int>> ret(rows, vector<int>(cols));

		for (int r = 0; r < rows; r++) {
			for (int c = 0; c < cols; c++) {
				int flat = SHIFT(FLAT(cols, r, c), k, rows * cols);
				ret[GRID_R(cols, flat)][GRID_C(cols, flat)] = grid[r][c];
			}
		}

		return ret;
	}
};
```
