---
tags:
  - mdg
  - algorithm
  - interview
  - dsu
date: 2026-07-04
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/minimum-score-of-a-path-between-two-cities)

> [!tip] 요약
> - [[Disjoint Set (Data Structure)|DSU]] 로 풀면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260704100054.png]]

- 문제를 읽어보면 뭔가 이상한 것을 알 수 있다. 언뜻 보기에는 뭐 최단거리 찾는문젠가? 싶은데, 생각해보면 문제에서 정답으로 요구하고 있는 값은 그냥 연결되어있는 도시들을 그루핑하고, 그 그룹 내에 있는 도로 중에 최소비용을 가지는 놈만 반환하면 되는 것이다.
	- 왜냐면 같은 도시를 여러번 방문할수도, 같은 도로를 여러번 탈 수도 있고 정답이 원하는건 경로 전체의 비용 총합의 최소가 아니고 그냥 경로 상의 도로 하나에 대한 최소비용이니까.
	- 그니까 연결만 되어 있다면 어떻게든 그 최소비용을 가지는 도로를 타도록 할 수 있다. 따라서 그룹 안에 있는 도로들 중에 비용이 최소인 한 놈만 잡아내면 된다.
- 그렇다는 것은, 그냥 연결되어있는 도시들이 뭐가 있냐만 찾아주면 된다. 이건 [[Disjoint Set (Data Structure)|DSU]] 로 쉽게 찾을 수 있다.
- 그래서 코드는:

```cpp {8,14,26,34,37,40}
#define MAX_INT (0x7FFFFFFF)
#define MIN(a, b) ((a) < (b) ? (a) : (b))
#define MIN3(a, b, c) (MIN(MIN((a), (b)), (c)))

class DisjointSet {
	vector<int> parent;
	vector<int> height;

	vector<int> min_score;
public:
	DisjointSet(int size) {
		parent = vector<int>(size);
		height = vector<int>(size, 0);
		min_score = vector<int>(size, MAX_INT);

		for (int i = 0; i < size; i++) {
			parent[i] = i;
		}
	}

	void unionElems(int elem1, int elem2, int score) {
		int root1 = findRoot(elem1);
		int root2 = findRoot(elem2);

		if (root1 == root2) {
			min_score[root1] = MIN(min_score[root1], score);
			return;
		}

		if (height[root1] == height[root2]) {
			parent[root2] = root1;
			height[root1]++;

			min_score[root1] = MIN3(min_score[root1], min_score[root2], score);
		} else if (height[root1] > height[root2]) {
			parent[root2] = root1;
			min_score[root1] = MIN3(min_score[root1], min_score[root2], score);
		} else /* (height[root1] < height[root2]) */ {
			parent[root1] = root2;
			min_score[root2] = MIN3(min_score[root1], min_score[root2], score);
		}
	}

	int findRoot(int elem) {
		while (parent[elem] != elem) {
			elem = parent[elem];
		}
		return elem;
	}

	int getMinScore(int elem) {
		return min_score[findRoot(elem)];
	}
};

class Solution {
public:
	int minScore(int n, vector<vector<int>>& roads) {
		DisjointSet ds(n);

		for (auto &r : roads) {
			ds.unionElems(r[0] - 1, r[1] - 1, r[2]);
		}

		return ds.getMinScore(0);
	}
};
```

- DSU 에서 `min_score` 만 처리할 수 있도록 해주면 된다.
	- `L8,L14`: 우선 DSU 내에 `min_score` 을 저장할 수 있도록 해주고 처음에는 무한으로 초기화해준다.
	- 그리고 Union 할때만 저 `min_score` 를 업데이트 하면 된다.
		- `L26`: 만약 두 놈이 같은 집합에 속한다면, 그 집합의 root 에 대한 `min_score` 와 주어진 `score` 를 비교해서 더 작은 값으로 업데이트한다.
		- `L34,L37,L40`: 만약 두 놈이 다른 집합에 속한다면, 각 집합의 root 에 대한 `min_score` 들과 주어진 `score` 를 비교해서 더 작은 값으로 합집합의 root 에 대한 `min_score` 를 업데이트한다.
