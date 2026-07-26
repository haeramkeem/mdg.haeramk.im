---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-07-24
aliases:
  - LeetCode 44
  - LeetCode 44. Wildcard Matching
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/wildcard-matching)

> [!tip] 요약
> - [[(LeetCode) 10. Regular Expression Matching|LeetCode 10]] 와 같은 문제.

## 최종

> [!info]- 결과
> ![[Pasted image 20260724212748.png]]

- [[(LeetCode) 10. Regular Expression Matching|LeetCode 10]] 와 사실상 같은 문제다. 똑같은 방법으로 규칙찾아서 풀면 된다.
	- 다만 이 문제에서는 [[(LeetCode) 97. Interleaving String|LeetCode 97]] 처럼 double buffering 을 했다. 물론 LeetCode 10 에서도 해도 되는데 귀찮아서 안했띠

```cpp
class Solution {
	bool dp[2][2001] = {0};
public:
	bool isMatch(string s, string p) {
		if (p.empty()) {
			return s.empty();
		}

		if (s.empty()) {
			for (char c : p) {
				if (c != '*') {
					return false;
				}
			}
			return true;
		}

		int ns = s.size();
		int np = p.size();

		dp[0][0] = true;
		for (int j = 1; j <= ns; j++) {
			dp[0][j] = false;
		}

		for (int i = 1; i <= np; i++) {
			int pi = i - 1;
			int cur_i = i & 0x1;
			int prev_i = (i - 1) & 0x1;

			dp[cur_i][0] = (p[pi] == '*') && dp[prev_i][0];

			for (int j = 1; j <= ns; j++) {
				int sj = j - 1;

				if ('a' <= p[pi] && p[pi] <= 'z') {
					dp[cur_i][j] = (p[pi] == s[sj]) && dp[prev_i][j - 1];
				} else if (p[pi] == '?') {
					dp[cur_i][j] = dp[prev_i][j - 1];
				} else if (p[pi] == '*') {
					dp[cur_i][j] = dp[prev_i][j] || dp[cur_i][j - 1] || dp[prev_i][j - 1];
				}
			}
		}

		return dp[np & 0x1][ns];
	}
};
```
