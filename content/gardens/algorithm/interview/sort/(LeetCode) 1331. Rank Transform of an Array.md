---
tags:
  - mdg
  - algorithm
  - interview
  - sort
date: 2026-07-12
aliases:
  - LeetCode 1331
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/rank-transform-of-an-array)

> [!tip] 요약
> - 쉬운 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260712092440.png]]

- [[(LeetCode) 3534. Path Existence Queries in a Graph II|LeetCode 3534]] 풀 때처럼 sort 하고 index map 을 만들어서 풀면 된다.

```cpp
struct Elem {
	int num;
	int idx;

	bool operator<(const Elem& other) const {
		return num < other.num;
	}
};

class Solution {
public:
	vector<int> arrayRankTransform(vector<int>& arr) {
		int n = arr.size();
		vector<Elem> sorted(n);
		vector<int> sort_map(n);
		vector<int> ret(n);

		if (!n) {
			return ret;
		}

		for (int i = 0; i < n; i++) {
			sorted[i].num = arr[i];
			sorted[i].idx = i;
		}

		sort(sorted.begin(), sorted.end());

		for (int i = 0; i < n; i++) {
			sort_map[sorted[i].idx] = i;
		}

		ret[sorted[0].idx] = 1;
		for (int i = 1; i < n; i++) {
			if (sorted[i - 1].num < sorted[i].num) {
				ret[sorted[i].idx] = ret[sorted[i - 1].idx] + 1;
			} else {
				ret[sorted[i].idx] = ret[sorted[i - 1].idx];
			}
		}

		return ret;
	}
};
```

## 다른 풀이

### Map

> [!info]- 결과
> ![[Pasted image 20260712091414.png]]

> [!info]- 코드
> ```cpp
> class Solution {
> public:
> 	vector<int> arrayRankTransform(vector<int>& arr) {
> 		int n = arr.size();
> 		map<int, int> to_rank;
> 		vector<int> ret(n);
>
> 		for (int num : arr) {
> 			to_rank[num] = 0;
> 		}
>
> 		int rank = 1;
> 		for (auto &p : to_rank) {
> 			p.second = rank++;
> 		}
>
> 		for (int i = 0; i < n; i++) {
> 			ret[i] = to_rank[arr[i]];
> 		}
>
> 		return ret;
> 	}
> };
> ```

- Map 도 $O(nlogn)$ 이어서 괜찮겠거니 했는데, 생각보다 느리다.