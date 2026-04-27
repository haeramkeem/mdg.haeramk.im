---
tags:
  - mdg
  - algorithm
  - data-structure
  - dsu
  - terms
date: 2026-04-21
aliases:
  - Disjoint Set
  - Disjoint Set Union
  - DSU
  - dsu
---
> [!info] 참고한 것들
> - [누군가의 블로그](https://gmlwjd9405.github.io/2018/08/31/algorithm-union-find.html)

## Disjoint Set

- Disjoint set (DSU) 은 말 그대로 전체를 겹치지 않는 부분집합으로 나눈 자료구조이다. 따라서 다음의 두 조건을 만족해야 한다:
	- 모든 부분집합의 합집합은 전체집합
	- 어떤 두 부분집합도 교집합을 가지지 않음
- 보통 부분집합을 합치는 `union` operation 과 부분집합을 찾는 `find` operation 을 지원한다.

## Tree 를 이용한 구현

- 보통 이 DSU 를 구현할 때는 tree 를 사용한다.
- tree 의 각 root 가 하나의 부분집합이 되는 셈.

### 초기화

- 두 개의 vector 를 사용한다: `parent` 와 `height`.
	- `parent` 는 index `i` 의 부모 index 를 저장한다. 처음에는 모두 자기자신이 되도록 `parent[i] = i` 로 초기화한다.
	- `height` 는 본인 아래에 달려 있는 sub-tree 의 높이를 의미한다. 처음에는 모두 자기자신밖에 없기 때문에 1 (혹은 0 - 상관없음) 로 초기화한다.
- 이 `height` 는 사용하지 않아도 상관없으나, 최적화를 위한 것이다.
	- 당연히 tree 라는 것이 본디 height 가 낮을수록 빠르기 때문에 각 tree 의 height 를 낮게 유지하기 위한 목적인 것.
	- 만약 이 `height` 가 없다면 최악의 경우 linked list 가 돼버린다.

### find

- Tree root 가 부분집합의 abstract 이므로, 어떤 원소가 속한 부분집합을 찾는 `find()` operation 은 자연스레 해당 원소가 속한 tree 의 root 를 찾는 문제가 된다.
- 그래서 그냥 재귀를 사용하던 iterator 를 사용하던 `parent` 를 타고 올라가며 root 를 찾으면 된다.

### union

- 두 원소가 속하는 부분집합을 합치는 연산.
- 마찬가지로 tree root 가 부분집합의 abstract 이므로, 두 원소에 대한 root 를 찾은 후 한 root 의 parent 가 나머지 root 가 되도록 한다.
- 이때, `height` 가 최소화되도록 해야 하므로 `height` 가 작은 쪽이 큰 쪽으로 포섭될 수 있도록 하고, 만약에 같다면 어느 쪽으로 포섭해도 상관없지만 대신 root 가 바뀌지 않은 쪽의 `height` 가 1 증가한다.

### 코드 (C++)

```cpp
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

		if (root0 == root1) {
			return;
		}

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
		int iter = idx;

		while (parent[iter] != iter) {
			iter = parent[iter];
		}
		
		return iter;
	}
};
```
