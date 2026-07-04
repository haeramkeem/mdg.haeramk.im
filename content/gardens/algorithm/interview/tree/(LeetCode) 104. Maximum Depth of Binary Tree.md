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
> - [LeetCode](https://leetcode.com/problems/maximum-depth-of-binary-tree)

> [!tip] 요약
> - 그냥 BFS 하면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260704110132.png]]

- 그냥 BFS 하면 되는데, 개꿀인건 여기서 `val` 이 아예 의미가 없다는 것이다.
	- 그래서 각 `TreeNode` 의 depth 를 저장하는 용도로 편하게 사용할 수 있다.

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
	int maxDepth(TreeNode* root) {
		if (!root) {
			return 0;
		}

		queue<TreeNode*> q;
		int depth = 0;

		root->val = 1;
		q.push(root);

		while (!q.empty()) {
			auto cur = q.front();

			depth = cur->val;

			if (cur->left) {
				cur->left->val = cur->val + 1;
				q.push(cur->left);
			}

			if (cur->right) {
				cur->right->val = cur->val + 1;
				q.push(cur->right);
			}

			q.pop();
		}

		return depth;
	}
};
```
