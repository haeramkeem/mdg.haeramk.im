---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-04-04
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/triangle)

> [!tip] 요약
> - 문제를 잘 읽자.

## 최종

> [!info]- 결과
> ![[Pasted image 20260404180916.png]]

- 문제를 잘못읽어서 디버깅 시간이 좀 걸렸다.
	- 난 같은 level에서 옆으로도 움직일 수 있는줄 알았지뭐야
- [[(LeetCode) 3418. Maximum Amount of Money Robot Can Earn|LeetCode 3418]] 이랑 비슷한 전략으로 DP 를 하면 된다.
	- 문제의 `Follow up` 에서 나온 대로, 1차원 DP를 만들고 각 cell 에 도달할 수 있는 최소의 값을 구해나가면 된다.
	- 물론 1차원 DP이니까, index conversion은 해줘야 된다.
- 그래서 코드는:

```cpp
#define TO_IDX(level, level_idx) ((((level) * (level + 1)) >> 1) + (level_idx))
#define MIN(a, b) ((a) < (b) ? (a) : (b))
#define MAX_I32 (0x7FFFFFFF)

class Solution {
public:
	int minimumTotal(vector<vector<int>>& triangle) {
		int nums_cnt = (triangle.size() * (triangle.size() + 1)) >> 1;
		auto dp = vector<int>(nums_cnt, 0);
		int ret = MAX_I32;

		dp[0] = triangle[0][0];

		for (int level = 1; level < triangle.size(); level++) {
			for (int level_idx = 0; level_idx <= level; level_idx++) {
				if (level_idx == 0) {
					dp[TO_IDX(level, 0)] = triangle[level][0] +
					                       dp[TO_IDX((level - 1), 0)];
				} else if (level_idx == level) {
					dp[TO_IDX(level, level)] = triangle[level][level] +
					                           dp[TO_IDX(level - 1, level - 1)];
				} else {
					dp[TO_IDX(level, level_idx)] = triangle[level][level_idx] +
					                               MIN(dp[TO_IDX(level - 1, level_idx - 1)],
					                                   dp[TO_IDX(level - 1, level_idx)]);
				}
			}
		}

		for (int i = nums_cnt - triangle.size(); i < nums_cnt; i++) {
			ret = MIN(ret, dp[i]);
		}

		return ret;
	}
};
```
