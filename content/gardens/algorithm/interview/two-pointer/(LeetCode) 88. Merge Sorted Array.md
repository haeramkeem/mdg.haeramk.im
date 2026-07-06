---
tags:
  - mdg
  - algorithm
  - interview
  - two-pointer
date: 2026-07-03
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/merge-sorted-array)

> [!tip] 요약
> - 그냥 [[Merge Sort (Algorithm)|Merge Sort]] 하면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260703130218.png]]

- 그냥 [[Merge Sort (Algorithm)|Merge Sort]] 하면 된다. 다만, `nums1` 의 원소들을 in-place 로 처리하기 귀찮아서 그냥 copy 해서 merge 했다.

```cpp
class Solution {
public:
	void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
		vector<int> nums1_clone(m);
		int i_1 = 0;
		int i_2 = 0;

		for (int i = 0; i < m; i++) {
			nums1_clone[i] = nums1[i];
		}

		for (int i = 0; i < m + n; i++) {
			if (i_1 < m && i_2 < n) {
				if (nums1_clone[i_1] < nums2[i_2]) {
					nums1[i] = nums1_clone[i_1];
					i_1++;
				} else {
					nums1[i] = nums2[i_2];
					i_2++;
				}
			} else if (i_1 < m) {
				nums1[i] = nums1_clone[i_1];
				i_1++;
			} else if (i_2 < n) {
				nums1[i] = nums2[i_2];
				i_2++;
			} else {
				// Should not happen
			}
		}
	}
};
```
