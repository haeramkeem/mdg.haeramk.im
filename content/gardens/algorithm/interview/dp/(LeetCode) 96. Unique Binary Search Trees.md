---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-07-16
aliases:
  - LeetCode 96
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/unique-binary-search-trees)

> [!tip] 요약
> - 점화식찾기

## 최종

> [!info]- 결과
> ![[Pasted image 20260716162754.png]]

- `dp[i]` 에 대한 점화식은 다음과 같다.
	- Root 의 왼쪽에만 달려있는 경우: 이때는 `dp[i - 1]` 이다.
	- Root 의 오른쪽에만 달려있는 경우: 마찬가지로 `dp[i - 1]` 이다.
	- Root 의 양쪽에 모두 달려있는 경우:
		- 왼쪽의 node 수가 `l` 개라고 하고, 오른쪽의 node 수가 `r` 개라고 하자.
		- 그럼 `1 <= l,r <= i - 1` 이고, `l + r == i - 1` 이 될것이다.
		- 총 경우의 수는 위를 만족하는 `l` 와 `r` 에 대해 `dp[l] * dp[r]` 이다.
- 코드는:

```cpp
class Solution {
public:
	int numTrees(int n) {
		vector<int> dp(n + 1, 0);

		dp[1] = 1;

		for (int i = 2; i <= n; i++) {
			dp[i] += dp[i - 1] * 2;

			for (int l = 1; l <= i - 2; l++) {
				dp[i] += dp[l] * dp[i - l - 1];
			}
		}

		return dp[n];
	}
};
```
