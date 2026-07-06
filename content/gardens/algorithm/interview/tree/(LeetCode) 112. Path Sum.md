---
tags:
  - mdg
  - algorithm
  - interview
  - tree
date: 2026-07-04
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/path-sum)

> [!tip] 요약
> - DFS 로 풀면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260704115506.png]]

- DFS 로 leaf 까지 내려가면서 총합이 `targetSum` 과 같은지 판단하면 된다.

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
	bool traverse(TreeNode *root, int acc, int target) {
		acc += root->val;

		if (!root->left && !root->right) {
			return acc == target;
		}

		if (root->left) {
			if (traverse(root->left, acc, target)) {
				return true;
			}
		}

		if (root->right) {
			return traverse(root->right, acc, target);
		}

		// Should not happen
		return false;
	}
public:
	bool hasPathSum(TreeNode* root, int targetSum) {
		if (!root) {
			return false;
		}
		return traverse(root, 0, targetSum);
	}
};
```

- 한가지 최적화? 라고 하긴 뭐하지만 처리해놓은 것은
	- Recursive 하게 DFS 를 할 때 `left` 를 먼저 탐색하게 하는데, 이쪽에서 정답이 나왔으면 `right` 는 탐색하지 않게 해두었다.