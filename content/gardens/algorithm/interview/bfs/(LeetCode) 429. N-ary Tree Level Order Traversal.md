---
tags:
  - mdg
  - algorithm
  - interview
  - bfs
date: 2026-06-22
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/n-ary-tree-level-order-traversal)

> [!tip] 요약
> - BFS 로 풀면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260622104028.png]]

- 그냥 bfs 돌리면 된다.

```cpp
/*
// Definition for a Node.
class Node {
public:
	int val;
	vector<Node*> children;

	Node() {}

	Node(int _val) {
		val = _val;
	}

	Node(int _val, vector<Node*> _children) {
		val = _val;
		children = _children;
	}
};
*/

#define PACK(level, val) ((level) << 16 | (val))
#define UNPACK_LEVEL(pack) (((pack) >> 16) & 0xFFFF)
#define UNPACK_VAL(pack) ((pack) & 0xFFFF)

class Solution {
public:
	vector<vector<int>> levelOrder(Node* root) {
		queue<Node*> q;
		vector<vector<int>> ans;

		if (!root) {
			return ans;
		}

		root->val = PACK(0, root->val);
		q.push(root);

		while (!q.empty()) {
			auto cur = q.front();
			int level = UNPACK_LEVEL(cur->val);
			int val = UNPACK_VAL(cur->val);
			q.pop();

			if (level == ans.size()) {
				ans.push_back({});
			}

			ans[level].push_back(val);

			for (auto c : cur->children) {
				c->val = PACK(level + 1, c->val);
				q.push(c);
			}
		}

		return ans;
	}
};
```

## 다른 풀이

### Go

> [!info]- 결과
> ![[Pasted image 20260622104234.png]]

> [!info]- 코드
> ```go
> type Wrapper struct {
> 	node	*Node
> 	index   int
> }
>
> func levelOrder(root *Node) [][]int {
> 	// Ignore empty
> 	if root == nil { return [][]int{} }
>
> 	// Add root to the queue
> 	q := []*Wrapper{
> 		{ node: root, index: 0 },
> 	}
>
> 	ret := make([][]int, 0)
> 	for i := 0; i < len(q); i++ {
> 		// Make init level element
> 		if q[i].index == len(ret) { ret = append(ret, make([]int, 0)) }
>
> 		// Add head to the queue
> 		ret[q[i].index] = append(ret[q[i].index], q[i].node.Val)
>
> 		// Add children to the queue
> 		for _, child := range q[i].node.Children {
> 			q = append(q, &Wrapper{ node: child, index: q[i].index + 1 })
> 		}
> 	}
>
> 	return ret
> }
> ```

- 이전에 Go 로 풀었던 기록이 있어서 옮겨버리기