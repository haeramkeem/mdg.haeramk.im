---
tags:
  - mdg
  - algorithm
  - interview
  - dsu
date: 2026-07-09
aliases:
  - LeetCode 3532
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/path-existence-queries-in-a-graph-i)

> [!tip] 요약
> - [[Disjoint Set (Data Structure)|DSU]] 로 풀면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260709102809.png]]

- Path 가 연결된 애들끼리 묶는 방식으로 [[Disjoint Set (Data Structure)|DSU]] 를 사용해 풀면 된다.
	- '연결된 애들' 을 찾는것도 간편하다. 만약 `nums[i + 1] - nums[i] <= maxDiff` 라면 `i + 1` 와 `i` 를 모두 같은 set 에 넣으면 된다.
	- 이렇게만 해도 되는 이유는 다음과 같다: `nums[i + 1] - nums[i] > maxDiff` 인데 `i` 와 `i + 1` 이 다른놈 `j` 를 거쳐서 같은 set 에 들어가도록 하는 `j` 가 존재하는지 알아보자.
		- `j < i` 라면,
			- `j` 를 거쳐서 `i` 와 `i + 1` 가 같은 set 에 들어가려면 (a): `nums[i] - nums[j] <= maxDiff` 이고 (b): `nums[i + 1] - nums[j] <= maxDiff` 여야 한다.
			- (b) 의 양변에 `nums[i] - nums[j]` 를 빼보자. 그럼 `nums[i + 1] - nums[i] <= maxDiff - (nums[i] - nums[j])` 가 된다.
			- 우선 좌변은 `nums[i - 1] - nums[i] > maxDiff` 라고 가정했기 때문에 `maxDiff` 보다 크다.
			- 하지만 우변은 (a) 에 의하면 `nums[i] - nums[j] <= maxDiff` 이므로 `maxDiff - (maxDiff 보다 작은놈)` 이 되어  `maxDiff` 보다 작다.
				- 또한, `nums[i] - nums[j] < 0` 일 수도 없다. `nums` 는 오름차순정렬되어있고 `j < i` 이기 때문.
			- 따라서 모순되기 때문에, 이걸 만족하는 `j` 는 존재하지 않는다.
		- `i < j < i + 1` 인 `j` 도 없다. `j` 는 자연수이기 때문.
		- `i + 1 < j` 인 경우에도, `j < i` 와 유사한 방식으로 `j` 가 존재하지 않음을 증명할 수 있다.
- 결과적으로 DSU 만 잘 구현해주면 이 문제는 금방 풀린다:

```cpp
class DisjointSet {
	vector<int> parent;
	vector<int> height;
public:
	DisjointSet(int n) {
		parent = vector<int>(n);
		height = vector<int>(n, 1);

		for (int i = 0; i < n; i++) {
			parent[i] = i;
		}
	}

	void unionSet(int elem1, int elem2) {
		int set1 = findSet(elem1);
		int set2 = findSet(elem2);

		if (set1 == set2) {
			return;
		}

		if (height[set1] == height[set2]) {
			parent[set2] = set1;
			height[set1]++;
		} else if (height[set1] < height[set2]) {
			parent[set1] = set2;
		} else /* (height[set1] > height[set2]) */ {
			parent[set2] = set1;
		}
	}

	int findSet(int elem) {
		while (elem != parent[elem]) {
			elem = parent[elem];
		}
		return elem;
	}
};

class Solution {
public:
	vector<bool> pathExistenceQueries(int n, vector<int>& nums, int maxDiff, vector<vector<int>>& queries) {
		DisjointSet ds(n);
		int qs = queries.size();
		vector<bool> ret(qs);

		for (int i = 0; i < n - 1; i++) {
			if (nums[i + 1] - nums[i] <= maxDiff) {
				ds.unionSet(i, i + 1);
			}
		}

		for (int i = 0; i < qs; i++) {
			ret[i] = ds.findSet(queries[i][0]) == ds.findSet(queries[i][1]);
		}

		return ret;
	}
};
```
