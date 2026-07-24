---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-07-24
aliases:
  - LeetCode 10
  - LeetCode 10. Regular Expression Matching
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/regular-expression-matching)

> [!tip] 요약
> - [[(LeetCode) 97. Interleaving String|LeetCode 97]] 과 비슷한 문제.

## 최종

> [!info]- 결과
> ![[Pasted image 20260724205142.png]]

- [[(LeetCode) 97. Interleaving String|LeetCode 97]] 처럼 `dp[][]` 로 풀면 된다.
- 어차피 한번 해보면 별로 어렵지 않게 규칙이 보이므로 자세한 설명은 생략.

```cpp
class Solution {
	bool dp[21][21] = {0};
public:
	Solution() {
		dp[0][0] = true;
	}

	bool isMatch(string s, string p) {
		int n_s = s.size();
		int n_p = p.size();

		for (int i = 1; i <= n_p; i++) {
			int i_p = i - 1;

			dp[i][0] = (p[i_p] == '*') && dp[i - 2][0];

			for (int j = 1; j <= n_s; j++) {
				int j_s = j - 1;

				if ('a' <= p[i_p] && p[i_p] <= 'z') {
					dp[i][j] = (p[i_p] == s[j_s]) && dp[i - 1][j - 1];
				} else if (p[i_p] == '.') {
					dp[i][j] = dp[i - 1][j - 1];
				} else if (p[i_p] == '*') {
					if (p[i_p - 1] == '.' || p[i_p - 1] == s[j_s]) {
						dp[i][j] = (dp[i][j - 1] || dp[i - 1][j] || dp[i - 2][j]);
					} else {
						dp[i][j] = dp[i - 2][j];
					}
				}
			}
		}

		return dp[n_p][n_s];
	}
};
```
