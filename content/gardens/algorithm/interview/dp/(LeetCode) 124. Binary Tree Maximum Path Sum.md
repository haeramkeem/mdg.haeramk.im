---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-07-28
aliases:
  - LeetCode 124
  - LeetCode 124. Binary Tree Maximum Path Sum
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/binary-tree-maximum-path-sum)

> [!tip] 요약
> - Recursion 으로 풀면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260729082956.png]]

- Recursion 으로 풀면 된다. 난이도가 hard 인것 치고 쉬운 문제.

```cpp
#define MIN_INT (0x80000000)

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
	int traverse(TreeNode *cur, int &global_max) {
		int cur_max = cur->val;
		int l_max = cur->val;
		int r_max = cur->val;
		int m_max;

		if (cur->left) {
			l_max += traverse(cur->left, global_max);
			cur_max = max(cur_max, l_max);
		}

		if (cur->right) {
			r_max += traverse(cur->right, global_max);
			cur_max = max(cur_max, r_max);
		}

		if (cur->left && cur->right) {
			global_max = max(global_max, l_max + r_max - cur->val);
		}

		global_max = max(global_max, cur_max);

		return cur_max;
	}
public:
	int maxPathSum(TreeNode* root) {
		int ret = MIN_INT;

		traverse(root, ret);

		return ret;
	}
};
```
