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
> - [LeetCode](https://leetcode.com/problems/same-tree)

> [!tip] 요약
> - 동일한 순서로 traverse 하면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260704084423.png]]

- 동일한 순서로 traverse 하면서 같은지 다른지 판단해주면 된다.
	- 아래 풀이는 BFS 로 푼 것이다.

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
	bool isSameTree(TreeNode* p, TreeNode* q) {
		if (!p || !q) {
			return !p && !q;
		}

		queue<TreeNode*> p_q;
		queue<TreeNode*> q_q;

		p_q.push(p);
		q_q.push(q);

		while (!p_q.empty() && !q_q.empty()) {
			auto p_cur = p_q.front();
			auto q_cur = q_q.front();

			if (p_cur->val != q_cur->val) {
				return false;
			}

			if (p_cur->left && q_cur->left) {
				p_q.push(p_cur->left);
				q_q.push(q_cur->left);
			} else if (p_cur->left || q_cur->left) {
				return false;
			}

			if (p_cur->right && q_cur->right) {
				p_q.push(p_cur->right);
				q_q.push(q_cur->right);
			} else if (p_cur->right || q_cur->right) {
				return false;
			}

			p_q.pop();
			q_q.pop();
		}

		return p_q.empty() && q_q.empty();
	}
};
```
