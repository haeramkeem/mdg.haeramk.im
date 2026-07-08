---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-07-08
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/generate-parentheses)

> [!tip] 요약
> - DP 인건 딱 보면 아는데, 점화식을 어떻게 할 지를 생각해보자.

## 최종

> [!info]- 결과
> ![[Pasted image 20260708100202.png]]

- 딱 보면 DP 인 것은 알 수 있다. 근데 점화식과 중복제거를 어떻게 할 지를 생각해봐야 한다.
	- 우선 `A[n]` 은:
		- `"()" + A[n-1]`, `"(" + A[n-1] + ")"`, `A[n-1] + "()"` 와
		- `A[2] + A[n-2]`, `A[n-2] + A[2]`,
		- `A[3] + A[n-3]`, `A[n-3] + A[3]`, ...
		- 이런식으로 구성된다. 그래서 `A[1]` ~ `A[n-1]` 를 전부 DP 에 저장해서 사용해야 한다.
		- 여기서 index 계산이 좀 귀찮은데, 이건 차근차근 해보면 알 수 있다.
	- 근데 위처럼 하면 중복이 발생한다. 그래서 아래 풀이에서는 그냥 `set` 을 사용했다.

```cpp
class Solution {
public:
	vector<string> generateParenthesis(int n) {
		vector<set<string>> dp;

		// n = 1
		dp.push_back({});
		dp[0].insert("()");

		for (int i = 2; i <= n; i++) {
			dp.push_back({});

			// Set[n] <- {Set[1], Set[n - 1]}
			for (auto &s : dp[i - 2]) {
				dp[i - 1].insert("()" + s);
				dp[i - 1].insert(s + "()");
				dp[i - 1].insert("(" + s + ")");
			}

			// Set[n] <- {Set[2], Set[n - 2]}, {Set[3]], Set[n - 3]}, ...
			for (int j = 2; j <= (i >> 1); j++) {
				for (auto &s1 : dp[j - 1]) {
					for (auto &s2 : dp[i - j - 1]) {
						dp[i - 1].insert(s1 + s2);
						dp[i - 1].insert(s2 + s1);
					}
				}
			}
		}

		vector<string> ret;

		for (auto &s : dp[n - 1]) {
			ret.push_back(s);
		}

		return ret;
	}
};
```
