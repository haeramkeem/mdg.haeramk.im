---
tags:
  - mdg
  - algorithm
  - interview
  - tree
date: 2026-07-04
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/balanced-binary-tree)

> [!tip] 요약
> - Recursive 하게 높이를 구하고 비교하면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260704113525.png]]

- 양쪽의 subtree 의 depth 를 recursive 하게 구하고, depth 가 2 이상 차이나는지 확인하면 된다.

```cpp
#define MAX(a, b) ((a) > (b) ? (a) : (b))
#define ABS_DIFF(a, b) ((a) > (b) ? (a) - (b) : (b) - (a))

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
	int getDepth(TreeNode *root) {
		if (!root) {
			return 0;
		}

		int left_depth = getDepth(root->left);
		int right_depth = getDepth(root->right);

		if (left_depth == -1 || right_depth == -1) {
			return -1;
		}

		if (ABS_DIFF(left_depth, right_depth) > 1) {
			return -1;
		}

		return MAX(left_depth, right_depth) + 1;
	}
public:
	bool isBalanced(TreeNode* root) {
		return getDepth(root) != -1;
	}
};
```
