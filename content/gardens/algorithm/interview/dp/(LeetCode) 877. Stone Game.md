---
tags:
  - mdg
  - algorithm
  - interview/retry
  - dp
date: 2026-08-02
aliases:
  - LeetCode 877
  - LeetCode 877. Stone Game
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/stone-game)

> [!tip] 요약
> - [[(LeetCode) 486. Predict the Winner|LeetCode 486]] 과 같은 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260802140658.png]]

- [[(LeetCode) 486. Predict the Winner|LeetCode 486]] 과 같은 방식으로 접근해서 풀면 된다.

```cpp
#define SUM(acc, l, r) ((acc)[(r) + 1] - (acc)[(l)])

class Solution {
	array<array<int, 500>, 500> dp;
	array<int, 501> acc;
public:
	bool stoneGame(vector<int>& piles) {
		int n = piles.size();

		acc[0] = 0;
		for (int i = 0; i < n; i++) {
			acc[i + 1] = acc[i] + piles[i];
		}

		for (int i = 0; i < n; i++) {
			dp[i][i] = piles[i];
		}

		for (int x = 1; x < n; x++) {
			for (int i = 0; i + x < n; i++) {
				int j = i + x;
				int take_i = piles[i] + (SUM(acc, i + 1, j) - dp[i + 1][j]);
				int take_j = piles[j] + (SUM(acc, i, j - 1) - dp[i][j - 1]);

				dp[i][j] = max(take_i, take_j);
			}
		}

		return dp[0][n - 1] > (SUM(acc, 0, n - 1) - dp[0][n - 1]);
	}
};
```
