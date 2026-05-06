---
tags:
  - mdg
  - algorithm
  - interview/retry
  - sort
date: 2026-04-28
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/minimum-operations-to-make-a-uni-value-grid)

> [!tip] 요약
> - 나중에 다시 한번 풀어보기

## 최종

> [!info]- 결과
> ![[Pasted image 20260428100731.png]]

- Test case 만 보면 중간값으로 uni-value grid 를 만들 수 있을거 같아 보였는데, 근데 다른 edge case 가 있을 것 같아서 안되는줄 알았다.
- 고민하다가 모르겠어서 정답 봤는데 중간값으로 하는게 맞더라.

```cpp
class Solution {
public:
	int minOperations(vector<vector<int>>& grid, int x) {
		vector<int> all;
		int median;
		int cnt = 0;

		for (auto &row : grid) {
			for (int cell : row) {
				all.push_back(cell);
			}
		}

		sort(all.begin(), all.end());

		median = all[all.size() >> 1];

		for (int num : all) {
			int diff = abs(median - num);

			if (diff % x != 0) {
				return -1;
			}

			cnt += diff / x;
		}

		return cnt;
	}
};
```
