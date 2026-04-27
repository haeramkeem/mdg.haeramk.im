---
tags:
  - mdg
  - algorithm
  - interview
  - brute-force
date: 2026-04-27
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/check-if-there-is-a-valid-path-in-a-grid)

> [!tip] 요약
> - 구현문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260427214321.png]]

- 별 알고리즘은 필요없는 그냥 구현문제다.

```cpp {11, 13-50, 69-70}
#define UP      0
#define RIGHT   1
#define DOWN    2
#define LEFT    3
#define INVALID 4

class Solution {
	int x;
	int y;
	int mod;
	vector<vector<bool>> visited;

	static constexpr int next[6][4][3] = {
		{
			{0, 0, INVALID},
			{0, -1, RIGHT},
			{0, 0, INVALID},
			{0, 1, LEFT},
		},
		{
			{1, 0, UP},
			{0, 0, INVALID},
			{-1, 0, DOWN},
			{0, 0, INVALID},
		},
		{
			{0, 0, INVALID},
			{0, 0, INVALID},
			{0, -1, RIGHT},
			{1, 0, UP}
		},
		{
			{0, 0, INVALID},
			{1, 0, UP},
			{0, 1, LEFT},
			{0, 0, INVALID},
		},
		{
			{0, -1, RIGHT},
			{0, 0, INVALID},
			{0, 0, INVALID},
			{-1, 0, DOWN}
		},
		{
			{0, 1, LEFT},
			{-1, 0, DOWN},
			{0, 0, INVALID},
			{0, 0, INVALID},
		}
	};

	bool move(vector<vector<int>> &grid) {
		if (x == grid.size() - 1 && y == grid[0].size() - 1) {
			return false;
		}

		if (visited[x][y]) {
			return false;
		}

		visited[x][y] = true;

		int next_mod = next[grid[x][y] - 1][mod][2];

		if (next_mod == INVALID) {
			return false;
		}

		int next_x = x + next[grid[x][y] - 1][mod][0];
		int next_y = y + next[grid[x][y] - 1][mod][1];

		if (next_x < 0 || next_x == grid.size() || next_y < 0 || next_y == grid[0].size()) {
			return false;
		}

		x = next_x;
		y = next_y;
		mod = next_mod;

		return true;
	}
public:
	bool hasValidPath(vector<vector<int>>& grid) {
		x = 0;
		y = 0;
		visited = vector<vector<bool>>(grid.size(), vector<bool>(grid[0].size(), false));

		switch (grid[0][0]) {
		case 1: mod = LEFT; break;
		case 2: mod = UP; break;
		case 3: mod = LEFT; break;
		case 4: {
			mod = RIGHT;
			while (move(grid)) {}
			if (x == grid.size() - 1 && y == grid[0].size() - 1) {
				return true;
			}

			x = 0;
			y = 0;
			vector<vector<bool>>(grid.size(), vector<bool>(grid[0].size(), false));
			mod = DOWN;
			break;
		}
		case 5: return x == grid.size() - 1 && y == grid[0].size() - 1;
		case 6: mod = UP; break;
		}

		while (move(grid)) {}

		return x == grid.size() - 1 && y == grid[0].size() - 1 && next[grid[x][y] - 1][mod][2] != INVALID;
	}
};
```

- 몇가지 짚어보자면
	1) L11 에 있는 `visited` 는 방문체크를 위해 필요하다. 이게 없으면 loop 를 방지하지 못한다.
	2) L13-50 는 street 종류와 현재 mod 별로 다음 좌표 delta 와 다음 mod 를 저장하는 배열이다.
		- 즉, `next[street 타입 - 1][mod]` 는 `{x좌표 delta, y좌표 delta, 다음 mod}` 이다.
		- 이때 `mod` 는 현재 좌표에 대한 진입방향이다. `UP = 0` 부터 시작해서 시계방향으로 1씩 증가되게 부여되어있다.
		- 이놈은 복잡한 branch 대신 현재 좌표의 street 타입과 mod 만 알면 바로 다음 좌표와 mod 를 알 수 있게 하기 위함이다.
	3) L69-70 의 `next_x` 와 `next_y` 는 반드시 필요하다. `x` 와 `y` 가 바뀌기 때문에 바꾸기 전 값을 이용해 다음 좌표를 계산해서 memoize 해놓아야 하기 때문.