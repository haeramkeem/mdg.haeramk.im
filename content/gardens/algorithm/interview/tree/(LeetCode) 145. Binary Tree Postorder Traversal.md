---
tags:
  - mdg
  - algorithm
  - interview
  - tree
date: 2026-07-05
aliases:
  - LeetCode 145
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/binary-tree-postorder-traversal)

> [!tip] 요약
> - Postorder 구현 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260705071306.png]]

- 그냥 postorder traversal 구현하면 되는 쉬운 문제다.

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
	void traverse(TreeNode *root, vector<int> &store) {
		if (!root) {
			return;
		}

		traverse(root->left, store);
		traverse(root->right, store);
		store.push_back(root->val);
	}
public:
	vector<int> postorderTraversal(TreeNode* root) {
		vector<int> ret;

		traverse(root, ret);

		return ret;
	}
};
```
