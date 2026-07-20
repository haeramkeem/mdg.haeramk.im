---
tags:
  - mdg
  - algorithm
  - interview/retry
  - dp
date: 2026-07-13
aliases:
  - LeetCode 72
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/edit-distance)

> [!tip] 요약
> - 다음에 다시 풀어보자.

## 최종

> [!info]- 결과
> ![[Pasted image 20260713125741.png]]

- `word1` 의 크기를 `n1`, `word2` 의 크기를 `n2` 라고 해보자.
- 2차원 DP `dp[n1 + 1][n2 + 1]` 를 사용하면 된다.
	1. 각 cell 의 의미:
		- Substring `word1[0:i]` 를 substring `word2[0:j]` 로 변경하는 최소 operation 의 횟수가 `dp[i + 1][j + 1]` 이다.
	2. 초기화 규칙:
		1) `dp[i + 1][0]` 은 `word1[0:i]` 를 `""` 로 만드는 비용이다. 따라서 이건 항상 `i + 1` 와 같다.
		2) 마찬가지로 `dp[0][j + 1]` 은 `""` 를 `word2[0:j]` 로 만드는 비용이고, 그래서 항상 `j + 1` 와 같다.
		3) 동일한 논리로 `dp[0][0]` 은 `""` 을 `""` 로 만드는 비용이기 때문에 0이다.
	3. `dp[i + 1][j + 1]` 도출 방법:
		1) `word1[0:i-1]` 에서 `word2[0:j]` 로 만드는 최소 operation 의 횟수는 `dp[i][j + 1]` 이다. 따라서 `word1[0:i]` 에서 `word1[i]` 를 delete 해서 `word1[0:i-1]` 로 만들어 주고, 이를 `word2[0:j]` 바꿔주면 된다. 그럼 총 operation 의 횟수는 `dp[i][j + 1] + 1` 이다.
		2) `word1[0:i]` 에서 `word2[0:j-1]` 로 만드는 최소 operation 의 횟수는 `dp[i + 1][j]` 이다. 따라서 `word1[0:i]` 를 `word2[0:j-1]` 로 만들어주고 마지막에 `word2[j]` 를 insert 해주면 `word2[0:j]` 가 된다. 그럼 총 operation 의 횟수는 `dp[i + 1][j] + 1` 이다.
		3) `word1[0:i-1]` 에서 `word2[0:j-1]` 로 만드는 최소 operation 의 횟수는 `dp[i][j]` 이다. 우선 `word1[0:i]` 안의 `word1[0:i-1]` substring 을 `word2[0:j-1]` 로 바꿔준다. 그리고 `word1[i]` 를 `word2[j]` 로 replace 해주면 `word2[0:j]` 가 된다. 그럼 총 operation 의 횟수는 `dp[i][j] + 1` 이다. 다만, `word1[i]` 와 `word2[j]` 같으면 replace 해줄 필요가 없다. 따라서 이때는 operation 횟수가 `dp[i][j]` 가 된다.
- 이를 코드로 구현하면 다음과 같다:

```cpp
class Solution {
public:
	int minDistance(string word1, string word2) {
		int n1 = word1.size();
		int n2 = word2.size();
		vector<vector<int>> dp(n1 + 1, vector<int>(n2 + 1));

		// (2-1)
		for (int i = 0; i < n1; i++) {
			dp[i + 1][0] = i + 1;
		}

		// (2-2)
		for (int j = 0; j < n2; j++) {
			dp[0][j + 1] = j + 1;
		}

		// (2-3)
		dp[0][0] = 0;

		for (int i = 0; i < n1; i++) {
			for (int j = 0; j < n2; j++) {
				int op_delete = dp[i][j + 1] + 1; // (3-1)
				int op_insert = dp[i + 1][j] + 1; // (3-2)
				int op_replace = dp[i][j]; // (3-3)

				op_replace += (word1[i] == word2[j] ? 0 : 1);

				dp[i + 1][j + 1] = min(min(op_delete, op_insert), op_replace);
			}
		}

		return dp[n1][n2];
	}
};
```
