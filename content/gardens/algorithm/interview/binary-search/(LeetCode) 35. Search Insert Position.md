---
tags:
  - mdg
  - algorithm
  - interview
  - binary-search
date: 2026-06-22
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/search-insert-position)

> [!tip] 요약
> - 그냥 binary search 하면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260622174310.png]]

- 조건처리하는것 때문에 좀 귀찮을 순 있는데, 그래도 그냥 binary search 하면 된다.

```cpp
class Solution {
public:
	int searchInsert(vector<int>& nums, int target) {
		if (target <= nums.front()) {
			return 0;
		}

		if (nums.back() <= target) {
			return nums.size() - (nums.back() == target ? 1 : 0);
		}

		int l = 0;
		int r = nums.size() - 1;

		while (l + 1 < r) {
			int m = (l + r) >> 1;

			if (target <= nums[m]) {
				r = m;
			} else if (nums[m] <= target) {
				l = m;
			} else {
				// Should not happen
				return -1;
			}
		}

		if (nums[l] == target) {
			return l;
		} else if (nums[r] == target) {
			return r;
		}

		return r;
	}
};
```
