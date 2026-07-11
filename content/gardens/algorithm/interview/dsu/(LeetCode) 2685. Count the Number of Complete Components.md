---
tags:
  - mdg
  - algorithm
  - interview
  - dsu
date: 2026-07-11
aliases:
  - LeetCode 2685
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/count-the-number-of-complete-components)

> [!tip] 요약
> - [[Disjoint Set (Data Structure)|DSU]] 로 풀면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260711110232.png]]

- [[Disjoint Set (Data Structure)|DSU]] 로 subgraph 들을 저장하고, 여기에 추가적으로 subgraph 의 크기도 저장하게 한다.
- 그리고 subgraph 내의 모든 vertex 에 대해 연결된 edge 의 개수가 subgraph 의 크기보다 1작아야 completed 이다. 이걸 이용해 completed 가 아닌 애들을 걸러주면 된다.

```cpp
class DisjointSet {
	vector<int> parent;
	vector<int> height;
	vector<int> size;
public:
	DisjointSet(int n) {
		parent = vector<int>(n);
		height = vector<int>(n, 1);
		size = vector<int>(n, 1);

		for (int i = 0; i < n; i++) {
			parent[i] = i;
		}
	}

	void unionSubset(int idx1, int idx2) {
		int set1 = findSubset(idx1);
		int set2 = findSubset(idx2);

		if (set1 == set2) {
			return;
		}

		if (height[set1] < height[set2]) {
			parent[set1] = set2;
			size[set2] += size[set1];
		} else if (height[set1] > height[set2]) {
			parent[set2] = set1;
			size[set1] += size[set2];
		} else /* (height[set1] == height[set2]) */ {
			parent[set2] = set1;
			height[set1]++;
			size[set1] += size[set2];
		}
	}

	int findSubset(int idx) {
		while (idx != parent[idx]) {
			idx = parent[idx];
		}
		return idx;
	}

	int getSubsetSize(int subset) {
		return size[subset];
	}
};

class Solution {
public:
	int countCompleteComponents(int n, vector<vector<int>>& edges) {
		DisjointSet ds(n);
		vector<int> num_edges(n, 0);
		set<int> completed;

		// Build subgraph DS
		for (auto &edge : edges) {
			ds.unionSubset(edge[0], edge[1]);
			num_edges[edge[0]]++;
			num_edges[edge[1]]++;
		}

		// List all subgraphs
		for (int v = 0; v < n; v++) {
			completed.insert(ds.findSubset(v));
		}

		// Delete all non-completed subgraphs
		for (int v = 0; v < n; v++) {
			int subset = ds.findSubset(v);
			if (ds.getSubsetSize(subset) != num_edges[v] + 1) {
				completed.erase(subset);
			}
		}

		return completed.size();
	}
};
```
