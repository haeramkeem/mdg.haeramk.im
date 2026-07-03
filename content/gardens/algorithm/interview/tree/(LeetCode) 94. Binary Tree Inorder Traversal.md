---
tags:
  - mdg
  - algorithm
  - interview
  - tree
date: 2026-07-04
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/binary-tree-inorder-traversal)

> [!tip] 요약
> - Inorder 구현문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260704082503.png]]

- Inorder tree traversal 을 구현하는 간단한 문제다.

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
	void traverse(TreeNode *cur, vector<int> &store) {
		if (cur) {
			if (cur->left) {
				traverse(cur->left, store);
			}

			store.push_back(cur->val);

			if (cur->right) {
				traverse(cur->right, store);
			}
		}
	}
public:
	vector<int> inorderTraversal(TreeNode* root) {
		vector<int> ret;

		traverse(root, ret);

		return ret;
	}
};
```
