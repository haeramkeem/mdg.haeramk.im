---
tags:
  - mdg
  - algorithm
  - interview
  - tree
date: 2026-07-04
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/minimum-depth-of-binary-tree)

> [!tip] 요약
> - BFS 로 자식이 없는 첫번째 노드를 찾으면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260704114235.png]]

- BFS 는 depth 가 작은 순서대로 노드를 탐색하기 때문에, BFS 로 자식이 없는 첫번째 노드를 찾으면 된다.
	- 이 문제에서 `TreeNode::val` 이 무의미하기 때문에, 이놈을 depth 를 저장하도록 사용했다.

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
	int minDepth(TreeNode* root) {
		if (!root) {
			return 0;
		}

		queue<TreeNode*> q;

		root->val = 1;
		q.push(root);

		while (!q.empty()) {
			auto cur = q.front();

			if (!cur->left && !cur->right) {
				return cur->val;
			}

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

		// Should not happen
		return -1;
	}
};
```
