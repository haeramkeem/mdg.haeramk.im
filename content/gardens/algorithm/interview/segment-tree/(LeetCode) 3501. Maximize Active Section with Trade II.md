---
tags:
  - mdg
  - algorithm
  - interview
  - segment-tree
date: 2026-07-23
aliases:
  - LeetCode 3501
  - LeetCode 3501. Maximize Active Section with Trade II
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/maximize-active-section-with-trade-ii)

> [!tip] 요약
> - [[Segment Tree (Data Structure)|Segment Tree]] 사용하면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260724095420.png]]

- [[Segment Tree (Data Structure)|Segment Tree]] 사용해서 최대 trade 인 놈을 $O(logn)$ 으로 찾아주면 된다.
- 근데 아래 코드 속도는 개느리다. Random access 랑 recursion 때문인거같은데 더 최적화 안하고 일단은 여기까지.

```cpp
class Chunk {
	pair<int, int> l;
	pair<int, int> r;
public:
	Chunk(pair<int, int> &l, pair<int, int> &r): l(l), r(r) {}

	pair<int, int> &get_l() {
		return l;
	}

	pair<int, int> &get_r() {
		return r;
	}

	int size() const {
		return (l.second - l.first + 1) + (r.second - r.first + 1);
	}

	int trunc_size(int l_i, int r_i) {
		if (l.second < l_i || r_i < r.first) {
			return 0;
		}

		int l_first = max(l.first, l_i);
		int r_second = min(r.second, r_i);

		return (l.second - l_first + 1) + (r_second - r.first + 1);
	}

	bool operator>(const Chunk &other) const {
		return size() > other.size();
	}
};

class Chunks {
	vector<Chunk> data;
	vector<int> l_map;
	vector<int> r_map;

	void init_data(string &s) {
		int n = s.size();
		vector<pair<int, int>> zeros;

		for (int i = 0; i < n; i++) {
			if (s[i] == '0') {
				int e = i;

				for (; e + 1 < n && s[e + 1] == '0'; e++) {}

				zeros.push_back({i, e});
				i = e;
			}
		}

		for (int i = 1; i < zeros.size(); i++) {
			data.push_back(Chunk(zeros[i - 1], zeros[i]));
		}
	}

	void init_l_map(int n) {
		int d = data.size();

		l_map = vector<int>(n, -1);

		if (0 < d) {
			auto &l = data[0].get_l();

			for (int j = 0; j < l.first; j++) {
				l_map[j] = 0;
			}			
		}

		for (int i = 0; i < d; i++) {
			auto &l = data[i].get_l();

			for (int j = l.first; j <= l.second; j++) {
				l_map[j] = i;
			}
		}

		for (int i = 0; i + 1 < d; i++) {
			auto &l = data[i].get_l();
			auto &r = data[i].get_r();

			for (int j = l.second + 1; j < r.first; j++) {
				l_map[j] = i + 1;
			}
		}
	}

	void init_r_map(int n) {
		int d = data.size();

		r_map = vector<int>(n, -1);

		if (0 <= d - 1) {
			auto &r = data[d - 1].get_r();

			for (int j = r.second + 1; j < n; j++) {
				r_map[j] = d - 1;
			}			
		}

		for (int i = 0; i < d; i++) {
			auto &r = data[i].get_r();

			for (int j = r.first; j <= r.second; j++) {
				r_map[j] = i;
			}
		}

		for (int i = 1; i < d; i++) {
			auto &l = data[i].get_l();
			auto &r = data[i].get_r();

			for (int j = l.second + 1; j < r.first; j++) {
				r_map[j] = i - 1;
			}
		}
	}
public:
	Chunks(string &s) {
		init_data(s);
		init_l_map(s.size());
		init_r_map(s.size());
	}

	int size() const {
		return data.size();
	}

	Chunk &get(int idx) {
		return data[idx];
	}

	int find_l_map(int idx) {
		return l_map[idx];
	}

	int find_r_map(int idx) {
		return r_map[idx];
	}
};

struct ChunkTreeNode {
	int c_idx;
	ChunkTreeNode *left;
	ChunkTreeNode *right;

	ChunkTreeNode (int c_idx): c_idx(c_idx) {
		left = nullptr;
		right = nullptr;
	}
};

class ChunkTree {
	Chunks &chunks;
	ChunkTreeNode *root;

	ChunkTreeNode *init_tree_recurse(int l, int r) {
		if (l > r) {
			return nullptr;
		}

		if (l == r) {
			return new ChunkTreeNode(l);
		}

		int m = (l + r) >> 1;
		auto *left = init_tree_recurse(l, m);
		auto *right = init_tree_recurse(m + 1, r);

		auto &c_l = chunks.get(left->c_idx);
		auto &c_r = chunks.get(right->c_idx);

		auto *ret = new ChunkTreeNode(c_l > c_r ? left->c_idx : right->c_idx);
		ret->left = left;
		ret->right = right;

		return ret;
	}

	int get_max_recurse(int l, int r, ChunkTreeNode *cur, int lb, int rb) {
		int m = (lb + rb) >> 1;

		if (!cur) {
			return 0;
		}

		if (l == lb && r == rb) {
			return chunks.get(cur->c_idx).size();
		}

		if (r <= m) {
			return get_max_recurse(l, r, cur->left, lb, m);
		}
		
		if (m < l) {
			return get_max_recurse(l, r, cur->right, m + 1, rb);
		}

		int l_max = get_max_recurse(l, m, cur->left, lb, m);
		int r_max = get_max_recurse(m + 1, r, cur->right, m + 1, rb);

		return max(l_max, r_max);
	}

	void free_tree_recurse(ChunkTreeNode *cur) {
		if (cur->left) {
			free_tree_recurse(cur->left);
		}

		if (cur->right) {
			free_tree_recurse(cur->right);
		}

		delete cur;
	}
public:
	ChunkTree(Chunks &chunks): chunks(chunks) {
		root = init_tree_recurse(0, chunks.size() - 1);
	}

	~ChunkTree() {
		if (root) {
			free_tree_recurse(root);
		}
	}

	int get_max(int l, int r) {
		if (l > r) {
			return 0;
		}

		if (l == r) {
			return chunks.get(l).size();
		}

		return get_max_recurse(l, r, root, 0, chunks.size() - 1);
	}
};

class Solution {
	int query(vector<int> &q, int ones, Chunks &chunks, ChunkTree &tree) {
		int l = chunks.find_l_map(q[0]);
		int r = chunks.find_r_map(q[1]);

		if (l == -1 || r == -1) {
			return ones;
		}

		if (l > r) {
			return ones;
		}

		if (l == r) {
			return ones + chunks.get(l).trunc_size(q[0], q[1]);
		}

		int _max = 0;

		_max = max(_max, chunks.get(l).trunc_size(q[0], q[1]));
		_max = max(_max, chunks.get(r).trunc_size(q[0], q[1]));
		_max = max(_max, tree.get_max(l + 1, r - 1));

		return ones + _max;
	}
public:
	vector<int> maxActiveSectionsAfterTrade(string s, vector<vector<int>>& queries) {
		Chunks chunks(s);
		ChunkTree tree(chunks);
		int ones = 0;
		int n = queries.size();
		vector<int> ret(n);

		for (char c : s) {
			ones += c - '0';
		}

		for (int i = 0; i < n; i++) {
			ret[i] = query(queries[i], ones, chunks, tree);
		}

		return ret;
	}
};
```
