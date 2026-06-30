---
tags:
  - mdg
  - algorithm
  - interview
  - brute-force
date: 2026-07-01
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/remove-element)

> [!tip] 요약
> - 쉬운 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260701084556.png]]

- 이 문제는 [[(LeetCode) 26. Remove Duplicates from Sorted Array|LeetCode 26]] 처럼 접근하면 된다: 그냥 `val` 이랑 다른 값이 나올때마다 앞에서부터 덮어씌워주면 된다.

```cpp
class Solution {
public:
	int removeElement(vector<int>& nums, int val) {
		int cnt = 0;

		for (int num : nums) {
			if (num != val) {
				nums[cnt] = num;
				cnt++;
			}
		}

		return cnt;
	}
};
```
