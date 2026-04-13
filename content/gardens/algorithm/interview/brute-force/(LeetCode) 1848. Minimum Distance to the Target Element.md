---
tags:
  - mdg
  - algorithm
  - interview
  - brute-force
date: 2026-04-13
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/minimum-distance-to-the-target-element)

> [!tip] 요약
> - 생각 가는대로 풀면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260413185432.png]]

- 난이도도 `easy` 고 문제 보면 어떻게 풀면 될것 같은지 생각이 딱 든다.

```cpp
class Solution {
public:
	int getMinDistance(vector<int>& nums, int target, int start) {
		for (int i = 0; ; i++) {
			if (start + i < nums.size() && nums[start + i] == target) {
				return i;
			}

			if (0 <= start - i && nums[start - i] == target) {
				return i;
			}
		}

		// Should not happen
		return 0;
	}
};
```
