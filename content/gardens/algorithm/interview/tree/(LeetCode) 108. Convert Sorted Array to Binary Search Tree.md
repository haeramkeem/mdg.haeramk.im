---
tags:
  - mdg
  - algorithm
  - interview
  - tree
date: 2026-07-04
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree)

> [!tip] 요약
> - Binary search 하듯이 풀면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260704112235.png]]

- Binary search 하듯이 중간지점 잡고 양쪽을 BST 로 build 하는 것을 recursive 하게 하면 된다.

```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *	 int val;
 *	 TreeNode *left;
 *	 TreeNode *right;
 *	 TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *	 TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *	 TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
	TreeNode *makeBST(vector<int> &nums, int lb, int ub) {
		if (lb == ub) {
			return new TreeNode(nums[lb]);
		} else if (lb + 1 == ub) {
			return new TreeNode(nums[ub], new TreeNode(nums[lb]), nullptr);
		}

		int m = (lb + ub) >> 1;
		return new TreeNode(nums[m], makeBST(nums, lb, m - 1), makeBST(nums, m + 1, ub));
	}
public:
	TreeNode* sortedArrayToBST(vector<int>& nums) {
		return makeBST(nums, 0, nums.size() - 1);
	}
};
```
