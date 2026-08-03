---
tags:
  - mdg
  - algorithm
  - interview/retry
  - dp
date: 2026-07-31
aliases:
  - LeetCode 279
  - LeetCode 279. Perfect Squares
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/perfect-squares)

> [!tip] 요약
> - 나중에 한번 더 풀어보기

## 최종

> [!info]- 결과
> ![[Pasted image 20260731113604.png]]

- 일단 풀긴 했는데, 왜 이게 맞는건지는 확신이 안선다.
- `dp[i]` 를 `i` 를 만들 수 있는 perfect square 최소 개수라고 하자.
	- 이때 `r` 를 $r^2 \le i \lt (r+1)^2$ 라고 해보자.
	- 그럼 `1 <= j <= r` 인 어떤 `j` 에 대해, `i` 는 `j * j` 와 `i - j * j` 의 합으로 나타낼 수 있을거다.
	- `dp[j * j] == 1` 이므로 `dp[i] == dp[i - j * j] + 1` 이 된다.
	- 그래서 모든 `j` 에 대해 `dp[i - j * j] + 1` 의 최소값을 찾으면 그게 `dp[i]` 가 된다.
- 정답이 맞긴 한데, 위의 방식이 항상 `dp[i]` 를 최소로 만드는지는 증명을 못하겠다.
- 뭐 그래도 코드는:

```cpp
class Solution {
public:
	int numSquares(int n) {
		vector<int> dp(n + 1);
		int r = 1;

		dp[1] = 1;
		for (int i = 2; i <= n; i++){
			if (i == (r + 1) * (r + 1)) {
				r++;
				dp[i] = 1;
			} else {
				int min_num = 10000;

				for (int j = r; 0 < j; j--) {
					min_num = min(min_num, dp[i - j * j] + 1);
				}

				dp[i] = min_num;
			}
		}

		return dp[n];
	}
};
```
