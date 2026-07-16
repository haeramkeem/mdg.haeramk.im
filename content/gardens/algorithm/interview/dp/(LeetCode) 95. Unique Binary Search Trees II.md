---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-07-16
aliases:
  - LeetCode 95
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/unique-binary-search-trees-ii)

> [!tip] 요약
> - [[(LeetCode) 96. Unique Binary Search Trees|LeetCode 96]] 랑 동일하게 풀면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260716171716.png]]

- [[(LeetCode) 96. Unique Binary Search Trees|LeetCode 96]] 에서의 점화식에, tree handling 만 추가해주면 된다.
	- 좀 느리고 메모리사용량도 많은데, 뭐 `malloc` 때문이겠지.

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
	TreeNode *clone(TreeNode *src) {
		auto dst = new TreeNode();
		queue<TreeNode*> src_q;
		queue<TreeNode*> dst_q;

		src_q.push(src);
		dst_q.push(dst);

		while (!src_q.empty() && !dst_q.empty()) {
			auto src_f = src_q.front();
			auto dst_f = dst_q.front();

			if (src_f->left) {
				src_q.push(src_f->left);

				dst_f->left = new TreeNode();
				dst_q.push(dst_f->left);
			}

			if (src_f->right) {
				src_q.push(src_f->right);

				dst_f->right = new TreeNode();
				dst_q.push(dst_f->right);
			}

			src_q.pop();
			dst_q.pop();
		}

		return dst;
	}

	int label(TreeNode *dst, int next_label) {
		if (dst->left) {
			next_label = label(dst->left, next_label);
		}

		dst->val = next_label++;

		if (dst->right) {
			next_label = label(dst->right, next_label);
		}

		return next_label;
	}
public:
	vector<TreeNode*> generateTrees(int n) {
		vector<vector<TreeNode*>> dp(n + 1);

		dp[1].push_back(new TreeNode(0));

		for (int i = 2; i <= n; i++) {
			for (auto t : dp[i - 1]) {
				// Reuse previous
				dp[i].push_back(new TreeNode(0, t, nullptr));
			}

			for (auto t : dp[i - 1]) {
				dp[i].push_back(new TreeNode(0, nullptr, clone(t)));
			}

			for (int l = 1; l <= i - 2; l++) {
				int r = i - l - 1;

				for (auto lt : dp[l]) {
					for (auto rt : dp[r]) {
						dp[i].push_back(new TreeNode(0, clone(lt), clone(rt)));
					}
				}
			}
		}

		for (auto t : dp[n]) {
			label(t, 1);
		}

		return dp[n];
	}
};
```
