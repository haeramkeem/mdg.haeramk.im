---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-07-31
aliases:
  - LeetCode 746
  - LeetCode 746. Min Cost Climbing Stairs
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/min-cost-climbing-stairs)

> [!tip] 요약
> - 전통과 역사

## 최종

> [!info]- 결과
> ![[Pasted image 20260731103136.png]]

- 근본이다.

```cpp
class Solution {
public:
	int minCostClimbingStairs(vector<int>& cost) {
		int n = cost.size();
		array<int, 2> dp{};

		for (int i = 2; i <= n; i++) {
			int cur = i & 0x1;
			int prev_1 = (i - 1) & 0x1;
			int prev_2 = (i - 2) & 0x1;
			dp[cur] = min(cost[i - 1] + dp[prev_1], cost[i - 2] + dp[prev_2]);
		}

		return dp[n & 0x1];
	}
};
```

## 다른 풀이

### Java

> [!info]- 결과
> ![[Pasted image 20260731103402.png]]

> [!info]- 코드
> ```java
> class Solution {
> 	public int minCostClimbingStairs(int[] cost) {
> 		int[] cache = new int[cost.length + 1];
> 		for (int i = 2; i < cache.length; i++) {
> 			cache[i] = Math.min(cost[i - 1] + cache[i - 1], cost[i - 2] + cache[i - 2]);
> 		}
> 		return cache[cache.length - 1];
> 	}
> }
> ```

- 이전 풀이 옮기기