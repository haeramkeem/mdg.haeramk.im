---
tags:
  - mdg
  - algorithm
  - interview
  - dp
  - grid
date: 2026-07-05
aliases:
  - LeetCode 1301
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/number-of-paths-with-max-score)

> [!tip] 요약
> - 동서남북으로 움직이지 않는 grid 는 DP 를 사용해보자.

## 최종

> [!info]- 결과
> ![[Pasted image 20260705110641.png]]

- 동서남북으로 움직이지 않는 grid 는 DP 를 사용해 풀 수 있다.
- 가령 이 문제의 경우, 한 위치에 도달하기 위해서는 아래서 올라오거나, 오른쪽에서 오거나, 아니면 오른쪽 아래에서 대각선으로 올라와야 한다.
	- 이 세 경로의 출발지 (즉, 아래서 올라올 때는 아래에 있는 cell, 오른쪽에서 올 때는 오른쪽에 있는 cell, 대각선으로 올 때는 오른쪽 아래에 있는 cell) 에 대한 값을 확정할 수 있다면, 현재의 값도 확정할 수 있다.
	- 근데 생각해보면 확정할 수 있다. $n \times n$ `board` 에서:
		- 우선 `board` 아래쪽 바닥에 있는 cell 들 (`board[n - 1][*]`) 은, 오른쪽에서 오는 선택지밖에 없다. 근데 바닥의 오른쪽 끝이 출발지이므로, 확정되어 있고, 그래서 나머지 cell 들도 순차적으로 확정할 수 있다.
		- 그리고 `board` 오른쪽 면에 있는 cell 들 (`board[*][n - 1]`) 은 아래에서 오는 선택지밖에 없다. 그래서 위와 같은 이유로 이들도 전부 확정지을 수 있다.
		- 이때, `board[n - 2][n - 2]` 도 확정할 수 있다: `board[n - 1][n - 1]` (시작점), `board[n - 1][n - 2]` (바닥 cell), `board[n - 2][n - 1]` (오른쪽 면) 이 모두 확정되어 있으므로.
		- 마찬가지로 `board[n - 2][n - 3]` 도 확정할 수 있다: `board[n - 1][n - 3]` (바닥 cell), `board[n - 1][n - 2]` (마찬가지로 바닥 cell), `board[n - 2][n - 2]` (방금 확정지음) 이 모두 확정되어 있으므로.
		- 이런식으로 하면 모두 확정지을 수 있다.
- 사실 이 방법을 알고 있으면 이 문제를 푸는건 쉽다. 코드 양이 많아서 좀 오래걸릴 뿐이지 고민할건 별로 없다.

```cpp
#define COST_IDX (0)
#define PATH_IDX (1)

#define MOD (1000000007)

class Solution {
	void updateDP(vector<vector<vector<int>>> &dp, vector<string>& board, int r, int c, int n) {
		int cur_cost = 0;

		// Get current cell's cost
		if ('1' <= board[r][c] && board[r][c] <= '9') {
			cur_cost = board[r][c] - '0';
		}

		// Update cell
		if (board[r][c] == 'X') {
			// Obstacle
			dp[r][c][COST_IDX] = 0; // Cost: 0
			dp[r][c][PATH_IDX] = 0; // # of valid path: 0
		} else if (r == n - 1 && c == n - 1) {
			// Initial (Position 'S')
			dp[r][c][COST_IDX] = 0; // Cost: 0
			dp[r][c][PATH_IDX] = 1; // # of valid path: 1
		} else if (c == n - 1) {
			// Right edge
			if (dp[r + 1][c][PATH_IDX] == 0) {
				// We can't reach here
				dp[r][c][COST_IDX] = 0; // Cost: 0
				dp[r][c][PATH_IDX] = 0; // # of valid path: 0
			} else {
				// Normal
				// Accumulate cost
				dp[r][c][COST_IDX] = dp[r + 1][c][COST_IDX] + cur_cost;
				// Import # paths
				dp[r][c][PATH_IDX] = dp[r + 1][c][PATH_IDX];
			}
		} else if (r == n - 1) {
			// Bottom edge
			if (dp[r][c + 1][PATH_IDX] == 0) {
				// We can't reach here
				dp[r][c][COST_IDX] = 0; // Cost: 0
				dp[r][c][PATH_IDX] = 0; // # of valid path: 0
			} else {
				// Normal
				// Accumulate cost
				dp[r][c][COST_IDX] = dp[r][c + 1][COST_IDX] + cur_cost;
				// Import # paths
				dp[r][c][PATH_IDX] = dp[r][c + 1][PATH_IDX];
			}
		} else {
			// Inner
			// 1. Right-to-left
			if (dp[r][c + 1][PATH_IDX] == 0) {
				// We can't reach here
				dp[r][c][COST_IDX] = 0; // Cost: 0
				dp[r][c][PATH_IDX] = 0; // # of valid path: 0
			} else {
				// Normal
				// Accumulate cost
				dp[r][c][COST_IDX] = dp[r][c + 1][COST_IDX] + cur_cost;
				// Import # paths
				dp[r][c][PATH_IDX] = dp[r][c + 1][PATH_IDX];
			}

			// 2. Update w/ down-to-up path
			if (dp[r + 1][c][PATH_IDX] == 0) {
				// We can't reach here w/ this path: skip
			} else {
				// Normal
				// Accumulate cost
				int cost = dp[r + 1][c][COST_IDX] + cur_cost;

				if (dp[r][c][COST_IDX] == cost) {
					// We've found a path w/ same cost
					// Accumulate & modulo # paths
					dp[r][c][PATH_IDX] = (dp[r][c][PATH_IDX] + dp[r + 1][c][PATH_IDX]) % MOD;
				} else if (dp[r][c][COST_IDX] < cost) {
					// We've found better path
					// Overwrite cost
					dp[r][c][COST_IDX] = cost;
					// Import # paths
					dp[r][c][PATH_IDX] = dp[r + 1][c][PATH_IDX];
				}
			}

			// 3. Update w/ diagonal path
			if (dp[r + 1][c + 1][PATH_IDX] == 0) {
				// We can't reach here w/ this path: skip
			} else {
				// Normal
				// Accumulate cost
				int cost = dp[r + 1][c + 1][COST_IDX] + cur_cost;

				if (dp[r][c][COST_IDX] == cost) {
					// We've found a path w/ same cost
					// Accumulate & modulo # paths
					dp[r][c][PATH_IDX] = (dp[r][c][PATH_IDX] + dp[r + 1][c + 1][PATH_IDX]) % MOD;
				} else if (dp[r][c][COST_IDX] < cost) {
					// We've found better path
					// Overwrite cost
					dp[r][c][COST_IDX] = cost;
					// Import # paths
					dp[r][c][PATH_IDX] = dp[r + 1][c + 1][PATH_IDX];
				}
			}
		}
	}
public:
	vector<int> pathsWithMaxScore(vector<string>& board) {
		int n = board.size();
		vector<vector<vector<int>>> dp(n, vector<vector<int>>(n, vector<int>(2, 0)));

		for (int r = n - 1; 0 <= r; r--) {
			updateDP(dp, board, r, n - 1, n);

			for (int c = n - 2; 0 <= c; c--) {
				updateDP(dp, board, r, c, n);
			}
		}

		return dp[0][0];
	}
};
```
