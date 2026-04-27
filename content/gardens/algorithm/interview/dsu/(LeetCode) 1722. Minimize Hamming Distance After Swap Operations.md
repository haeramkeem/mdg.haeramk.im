---
tags:
  - mdg
  - algorithm
  - interview/retry
  - dsu
date: 2026-04-21
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/minimize-hamming-distance-after-swap-operations)

> [!tip] 요약
> - 다음에 다시 한번 풀어보기

## 최종

> [!info]- 결과
> ![[Pasted image 20260421123054.png]]

- `allowedSwaps` 로 묶인 원소들 간에는 서로 막 바꿀 수 있다.
- 따라서,
	1. 우선 `allowedSwaps` 를 이용해서 전체를 [[Disjoint Set (Data Structure)|DSU]] 로 빌드하고
	2. 각 부분집합에 대해 `source` 를 이용해 histogram (즉, 값-출현횟수 매핑) 을 빌드한 후
		1) `source` 를 순회하는 `i` 에 대해
		2) DSU 에서 `i` 의 root 를 찾고
		3) 모든 root 에 대한 histogram 을 만들어서 여기에는 `source[i]` 와 출현 횟수를 카운팅한다.
	3. `target` 을 순회하며 해당 histogram 에 몇번 등장하는지 확인해주면 된다.
		1) `target` 을 순회하는 `i` 에 대해
		2) DSU 에서 `i` 의 root 를 찾고 해당하는 histogram 을 찾은 뒤에
		3) Histogram 에서 `target[i]` 이 없거나 count 가 0이면, hamming distance 를 늘리고
		4) 만약에 count 가 1 이상이면 count 를 1 감소
- 그래서 코드는 이렇게 짜주면 된다:

```cpp {44-46,48-52,54-67}
class DisjointSet {
	vector<int> parent;
	vector<int> height;
public:
	DisjointSet(int size) {
		parent = vector<int>(size);
		height = vector<int>(size, 1);

		for (int i = 0; i < size; i++) {
			parent[i] = i;
		}
	}

	void union_elems(int idx0, int idx1) {
		int root0 = find_root(idx0);
		int root1 = find_root(idx1);

		if (height[root0] == height[root1]) {
			parent[root0] = root1;
			height[root1]++;
		} else if (height[root0] > height[root1]) {
			parent[root1] = root0;
		} else /* height[root0] < height[root1] */ {
			parent[root0] = root1;
		}
	}

	int find_root(int idx) {
		if (parent[idx] == idx) {
			return idx;
		}

		return find_root(parent[idx]);
	}
};

class Solution {
public:
	int minimumHammingDistance(vector<int>& source, vector<int>& target, vector<vector<int>>& allowedSwaps) {
		DisjointSet dsu(source.size());
		map<int, map<int, int>> ds_histogram;
		int distance = 0;

		for (auto &swap : allowedSwaps) {
			dsu.union_elems(swap[0], swap[1]);
		}

		for (int i = 0; i < source.size(); i++) {
			int root = dsu.find_root(i);

			ds_histogram[root][source[i]]++;
		}

		for (int i = 0; i < source.size(); i++) {
			int root = dsu.find_root(i);
			auto &histogram = ds_histogram[root];

			if (histogram.find(target[i]) == histogram.end()) {
				distance++;
			} else {
				if (!histogram[target[i]]) {
					distance++;
				} else {
					histogram[target[i]]--;
				}
			}
		}

		return distance;
	}
};
```

- Line 44-46 이 DSU를 빌드하는 단계
- Line 48-52 이 `source` 의 각 root 에 대한 histogram 을 빌드하는 단계
- Line 54-67 이 `target` 을 순회하며 histogram 을 조회하는 단계이다.