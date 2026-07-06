---
tags:
  - mdg
  - algorithm
  - interview
  - tree
  - bfs
date: 2026-07-04
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/symmetric-tree)

> [!tip] 요약
> - [[(LeetCode) 100. Same Tree|LeetCode 100]] 와 유사한 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260704105147.png]]

- [[(LeetCode) 100. Same Tree|LeetCode 100]] 와 유사한 문제인데, 반대로만 비교해주면 된다.

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
public:
	bool isSymmetric(TreeNode* root) {
		// Assert(root)
		if (!root->left || !root->right) {
			return !root->left && !root->right;
		}

		queue<TreeNode*> l_q;
		queue<TreeNode*> r_q;

		l_q.push(root->left);
		r_q.push(root->right);

		while (!l_q.empty() && !r_q.empty()) {
			auto l_cur = l_q.front();
			auto r_cur = r_q.front();

			if (l_cur->val != r_cur->val) {
				return false;
			}

			if (l_cur->left && r_cur->right) {
				l_q.push(l_cur->left);
				r_q.push(r_cur->right);
			} else if (l_cur->left || r_cur->right) {
				return false;
			}

			if (l_cur->right && r_cur->left) {
				l_q.push(l_cur->right);
				r_q.push(r_cur->left);
			} else if (l_cur->right || r_cur->left) {
				return false;
			}

			l_q.pop();
			r_q.pop();
		}

		return l_q.empty() && r_q.empty();
	}
};
```
