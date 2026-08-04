---
tags:
  - mdg
  - algorithm
  - interview
  - sort
date: 2026-08-04
aliases:
  - LeetCode 3731
  - LeetCode 3731. Find Missing Elements
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/find-missing-elements)

> [!tip] 요약
> - [[Counting Sort (Algorithm)|Counting Sort]] 사용해서 풀기

## 최종

> [!info]- 결과
> ![[Pasted image 20260804093024.png]]

- 문제 자체보다 이 문제를 뭐로 분류할까에 더 시간을 많이 쓴 문제.
- 장고 끝에 [[Counting Sort (Algorithm)|Counting Sort]] 로 분류하기로 했다.

```cpp
class Solution {
	array<bool, 100> set{};
public:
	vector<int> findMissingElements(vector<int>& nums) {
		vector<int> ret;
		int l = 99;
		int r = 0;

		for (int num : nums) {
			set[num - 1] |= true;
			l = min(l, num - 1);
			r = max(r, num - 1);
		}

		for (int i = l; i <= r; i++) {
			if (!set[i]) {
				ret.push_back(i + 1);
			}
			set[i] = false;
		}

		return ret;
	}
};
```
