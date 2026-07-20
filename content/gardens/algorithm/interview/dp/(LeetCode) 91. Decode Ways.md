---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-07-15
aliases:
  - LeetCode 91
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/decode-ways)

> [!tip] 요약
> - 쉬운 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260715115801.png]]

- 딱 보면 점화식이 눈에 보이는 쉬운 문제.

```cpp
class Solution {
public:
	int numDecodings(string s) {
		int n = s.size();
		vector<int> dp(n, 0);

		for (int i = 0; i < n; i++) {

			if ('1' <= s[i] && s[i] <= '9') {
				dp[i] += (0 <= i - 1) ? dp[i - 1] : 1;
			}

			if (0 < i && s[i - 1] != '0') {
				char buf[3] = {0};

				buf[0] = s[i - 1];
				buf[1] = s[i];

				int num = atoi(buf);

				if (10 <= num && num <= 26) {
					dp[i] += (0 <= i - 2) ? dp[i - 2] : 1;
				}
			}
		}

		return dp[n - 1];
	}
};
```
