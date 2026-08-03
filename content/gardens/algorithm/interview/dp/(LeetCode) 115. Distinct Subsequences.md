---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-07-28
aliases:
  - LeetCode 115
  - LeetCode 115. Distinct Subsequences
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/distinct-subsequences)

> [!tip] 요약
> - 점화식 찾는 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260728081212.png]]

- [[(LeetCode) 97. Interleaving String|LeetCode 97]] 과 같은 방법으로 `dp[i][j]` 의 규칙을 찾으면 된다.
	- `dp[i][j]` 은 `t[0:i-1]` 와 `s[0:j-1]` 의 범위에서의 정답이다.
	- 만약 `t[i-1] != s[j-1]` 이라면 `s` 의 범위를 `s[0:j-2]` 에서 `s[0:j-1]` 로 늘려도 만들 수 있는 distinct subsequence 의 개수는 바뀌지 않는다. 따라서 이때는 `dp[i][j] == dp[i][j-1]` 이다.
	- 만약 `t[i-1] == s[j-1]` 이라면 아래 두 경우의 합이다.
		1) `s[j-1]` 를 사용하지 않았을 때의 distinct subsequence 의 개수: `dp[i][j-1]`
		2) `s[j-1]` 를 사용했을 때의 distinct subsequence 의 개수: `dp[i-1][j-1]`
- 이렇게 점화식이 되는데, 여기서 2가지의 최적화를 할 수 있다.
	1) 언제나 `dp[i-1][]` 까지만 참조하는 것을 알 수 있다. 따라서 [[(LeetCode) 97. Interleaving String|LeetCode 97]] 처럼 double buffering 을 할 수 있다.
	2) `dp[i][j]` 를 채울 때는 왼쪽 혹은 왼쪽 대각선 위를 참조하는 것을 알 수 있다. 이것을 2차원 DP 에서 궤적을 그려보면, `j` 의 범위는 `s.length - t.length + i` 까지인 것을 알 수 있다.
- 그래서 코드는:

```cpp
class Solution {
	array<array<unsigned int, 1001>, 2> dp{};
public:
	int numDistinct(string s, string t) {
		int tn = t.size();
		int sn = s.size();

		for (int j = 0; j <= sn - tn; j++) {
			dp[0][j] = 1;
		}

		for (int i = 1; i <= tn; i++) {
			int cur = i & 0x1;
			int prev = (i - 1) & 0x1;

			dp[cur][0] = 0;

			for (int j = 1; j <= sn - tn + i; j++) {
				if (t[i - 1] != s[j - 1]) {
					dp[cur][j] = dp[cur][j - 1];
				} else {
					dp[cur][j] = dp[cur][j - 1] + dp[prev][j - 1];
				}
			}
		}

		return dp[tn & 0x1][sn];
	}
};
```
