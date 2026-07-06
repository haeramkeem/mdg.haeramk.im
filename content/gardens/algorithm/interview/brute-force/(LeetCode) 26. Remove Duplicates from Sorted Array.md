---
tags:
  - mdg
  - algorithm
  - interview
  - brute-force
date: 2026-07-01
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/remove-duplicates-from-sorted-array)

> [!tip] 요약
> - 쉬운 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260701084014.png]]

- 이 문제의 크랙은 뒤에 쓰래기값을 남겨도 된다는거다.
- 그래서 그냥 unique 값이 나올때마다 앞에서부터 덮어씌워주면 된다.

```cpp
class Solution {
public:
	int removeDuplicates(vector<int>& nums) {
		int prev = nums[0];
		int cnt = 1;

		for (int num : nums) {
			if (num != prev) {
				nums[cnt] = num;
				prev = num;
				cnt++;
			}
		}

		return cnt;
	}
};
```
