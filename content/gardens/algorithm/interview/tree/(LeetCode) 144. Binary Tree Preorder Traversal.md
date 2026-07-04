---
tags:
  - mdg
  - algorithm
  - interview
  - tree
date: 2026-07-05
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/binary-tree-preorder-traversal)

> [!tip] 요약
> - Preorder traversal 은 stack 으로도 구현할 수 있다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260705070038.png]]

- Preorder 는 보통 recursion 으로 풀지만, iterative 하게 풀라면 stack 을 사용하면 된다.
	- 방법은 그냥 BFS 랑 비슷하게 하면 된다. BFS 에서 queue 를 stack 으로 바꾸면 preorder 가 된다.

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
	vector<int> preorderTraversal(TreeNode* root) {
		if (!root) {
			return {};
		}

		vector<int> ret;
		stack<TreeNode*> stk;

		stk.push(root);

		while (!stk.empty()) {
			auto cur = stk.top();
			stk.pop();

			ret.push_back(cur->val);

			if (cur->right) {
				stk.push(cur->right);
			}

			if (cur->left) {
				stk.push(cur->left);
			}
		}

		return ret;
	}
};
```
