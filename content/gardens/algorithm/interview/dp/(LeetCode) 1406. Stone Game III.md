---
tags:
  - mdg
  - algorithm
  - interview/retry
  - dp
date: 2026-08-03
aliases:
  - LeetCode 1406
  - LeetCode 1406. Stone Game III
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/stone-game-iii)

> [!tip] 요약
> - [[(LeetCode) 877. Stone Game|LeetCode 877]] 과 비슷한 문제
## 최종

> [!info]- 결과
> ![[Pasted image 20260804084341.png]]

- [[(LeetCode) 877. Stone Game|LeetCode 877]] 과 비슷한 발상을 하면 된다.
	- 일단 `v[]` 는 suffix sum 이다. 즉, `v[i]` 는 `stoneValue[i:]` 의 합이다.
	- `dp[i]` 는 `stoneValue[i:]` 가지고 게임을 할 때 Alice 가 먼저 시작하면 Alice 가 얻게되는 점수를 나타낸다.
		- 그럼 반대로 `stoneValue[i:]` 가지고 게임을 할 때 Bob 이 먼저 시작하면 Alice 가 얻게 되는 점수는 전체 점수에서 Alice 가 먼저 시작했을 때의 점수를 뺀거다. 즉, `v[i] - dp[i]` 이다.
		- `dp[i]` 는 다음의 세 경우 중에 가장 큰 값이다.
			- 만약 Alice 가 `i` 만 먹었다고 해보자.
				- 그럼 `stoneValue[i + 1:]` 에 대해 Bob 이 먼저 시작할 것이다. 그럼 이때 Alice 가 얻게 되는 점수는 `v[i + 1] - dp[i + 1]` 이다.
				- 그럼 총점은 `stoneValue[i] + v[i + 1] - dp[i + 1]` 가 된다. 하지만, `stoneValue[i] == v[i] - v[i + 1]` 이므로 정리하면 `v[i] - dp[i + 1]` 이 된다.
			- 만약 Alice 가 `i`, `i + 1` 을 먹었다고 해보자.
				- 그럼 `stoneValue[i + 2:]` 에 대해 Bob 이 먼저 시작할 것이다. 그럼 이때 Alice 가 얻게 되는 점수는 `v[i + 2] - dp[i + 2]` 이다.
				- 그럼 총점은 `stoneValue[i] + stoneValue[i + 1] + v[i + 2] - dp[i + 2]` 가 된다. 하지만, `stoneValue[i] + stoneValue[i + 1] == v[i] - v[i + 2]` 이므로 정리하면 `v[i] - dp[i + 2]` 이 된다.
			- 만약 Alice 가 `i`, `i + 1`, `i + 2` 을 먹었다고 해보자.
				- 그럼 `stoneValue[i + 3:]` 에 대해 Bob 이 먼저 시작할 것이다. 그럼 이때 Alice 가 얻게 되는 점수는 `v[i + 3] - dp[i + 3]` 이다.
				- 그럼 총점은 `stoneValue[i] + stoneValue[i + 1] + stoneValue[i + 2] + v[i + 3] - dp[i + 3]` 가 된다. 하지만, `stoneValue[i] + stoneValue[i + 1] + stoneValue[i + 2] == v[i] - v[i + 3]` 이므로 정리하면 `v[i] - dp[i + 3]` 이 된다.
	- 그럼 정답은 `dp[0]` (Alice) 와 `v[0] - dp[0]` (Bob) 중에 어느게 더 큰지를 찾으면 된다.
- 아래 코드는 여기에 circular queue 방식도 추가해서 최적화한 것이다.

```cpp
#define I(i) ((i) & 0x3)

class Solution {
public:
	string stoneGameIII(vector<int>& stoneValue) {
		vector<int> &v = stoneValue; // Alias
		array<int, 4> dp{};
		int n = v.size();

		for (int i = n - 2; 0 <= i; i--) {
			v[i] += v[i + 1];
		}

		for (int i = n - 1; 0 <= i; i--) {
			int take_1 = v[i] - dp[I(i + 1)];
			int take_2 = v[i] - dp[I(i + 2)];
			int take_3 = v[i] - dp[I(i + 3)];

			if (take_1 >= take_2 && take_1 >= take_3) {
				dp[I(i)] = take_1;
			} else if (take_2 >= take_1 && take_2 >= take_3) {
				dp[I(i)] = take_2;
			} else /* (take_3 >= take_1 && take_3 >= take_2) */ {
				dp[I(i)] = take_3;
			}
		}

		if (dp[0] > v[0] - dp[0]) {
			return "Alice";
		}

		if (v[0] - dp[0] > dp[0]) {
			return "Bob";
		}

		return "Tie";
	}
};
```
