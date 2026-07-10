---
tags:
  - mdg
  - algorithm
  - interview/retry
  - binary-lifting
date: 2026-07-09
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/path-existence-queries-in-a-graph-ii)

> [!tip] 요약
> - 나중에 다시 풀어보기

## 최종

> [!info]- 결과
> ![[Pasted image 20260710173227.png]]

- 다음의 두가지 발상을 떠올린다면 쉽게 풀 수 있다. 물론 [[index|주인장]] 은 떠올리지 못해서 힌트봤다.
	1) [[Binary Lifting (Algorithm)|Binary Lifting]] 을 사용할 것
	2) Binary Lifting 을 하기 위해서는 각 원소들을 chaining 해야 하는데, 이때 가장 멀리 가는 놈으로 `next` 를 설정할 것
- 사실 쉽게 풀 수 있다는 그짓말이다. 이걸 알아도 경우따져서 branch 나누거나 시시때때로 나는 timeout 막기 위해 고생하게 된다.
- 코드 설명은 생략; 어차피 나중가면 까먹으니까 나중에 한번 더 풀어보자.

```cpp
#define MIN(a, b) ((a) < (b) ? (a) : (b))
#define MAX(a, b) ((a) > (b) ? (a) : (b))

// 2^16 < 10^5 < 2^17
#define EXP_DEPTH (16)

struct Elem {
	int num;
	int idx;

	bool operator<(const Elem &other) {
		return num < other.num;
	}
};

class Solution {
public:
	vector<int> pathExistenceQueries(int n, vector<int>& nums, int maxDiff, vector<vector<int>>& queries) {
		vector<Elem> sorted(n);
		vector<int> sort_map(n);

		// Sort nums
		for (int i = 0; i < n; i++) {
			sorted[i].num = nums[i];
			sorted[i].idx = i;
		}

		sort(sorted.begin(), sorted.end());

		// Build sort map (index -> sorted index conversion)
		for (int i = 0; i < n; i++) {
			sort_map[sorted[i].idx] = i;
		}

		// Build exponential map
		vector<vector<int>> exp_map(n, vector<int>(EXP_DEPTH, -1));

		// Fill exponential map [0] w/ binary search
		for (int i = 0; i + 1 < n; i++) {
			int target = sorted[i].num + maxDiff;
			int l = i + 1;
			int r = n - 1;

			while (l + 1 < r) {
				int m = (l + r) >> 1;

				if (sorted[m].num <= target) {
					l = m;
				} else {
					r = m;
				}
			}

			if (sorted[r].num <= target) {
				exp_map[i][0] = r;
			} else if (sorted[l].num <= target) {
				exp_map[i][0] = l;
			}
		}

		// Fill exponential map [1,EXP_DEPTH)
		for (int j = 1; j < EXP_DEPTH; j++) {
			for (int i = 0; i < n; i++) {
				if (exp_map[i][j - 1] != -1) {
					exp_map[i][j] = exp_map[exp_map[i][j - 1]][j - 1];
				}
			}
		}

		// Proc queries
		int q_n = queries.size();
		vector<int> ret(q_n, -1);

		for (int i = 0; i < q_n; i++) {
			int u = queries[i][0];
			int v = queries[i][1];

			// Self
			if (u == v) {
				ret[i] = 0;
				continue;
			}

			int it = MIN(sort_map[u], sort_map[v]);
			int dst = MAX(sort_map[u], sort_map[v]);
			int dst_num = sorted[dst].num;

			// One-shot
			if (dst_num - sorted[it].num <= maxDiff) {
				ret[i] = 1;
				continue;
			}

			// Exponential jump
			int jumps = 0;
			while (sorted[it].num < dst_num) {
				int exp_jump = -1;

				for (int j = 0; j < EXP_DEPTH; j++) {
					int next = exp_map[it][j];

					// We can't jump 2^j steps
					if (next == -1) {
						break;
					}

					// Jump 2^j steps to reach to the dst
					if (sorted[next].num == dst_num) {
						exp_jump = j;
						break;
					}

					// Jump 1 more step to reach to the dst
					if (j == 0 && sorted[next].num > dst_num) {
						exp_jump = 0;
						break;
					}

					// Increase exponential jump count
					if (sorted[next].num < dst_num) {
						exp_jump = j;
					}
				}

				// We never reach to the dst
				if (exp_jump == -1) {
					jumps = -1;
					break;
				}

				// Do jump
				it = exp_map[it][exp_jump];
				jumps += (1 << exp_jump);
			}

			// Query result
			ret[i] = jumps;
		}

		return ret;
	}
};
```

## 다른 풀이

### Binary search

> [!info]- 코드
> ```cpp
> #define MIN(a, b) ((a) < (b) ? (a) : (b))
> #define MAX(a, b) ((a) > (b) ? (a) : (b))
>
> struct Elem {
> 	int num;
> 	int idx;
>
> 	bool operator<(const Elem &other) const {
> 		return num < other.num;
> 	}
> };
>
> class Solution {
> 	int findUpperBound(vector<Elem> &sorted, int target, int l, int r) {
> 		while (l + 1 < r) {
> 			int m = (l + r) >> 1;
>
> 			if (sorted[m].num <= target) {
> 				l = m;
> 			} else /* (sorted[m].num > target) */ {
> 				r = m;
> 			}
> 		}
>
> 		if (sorted[l].num <= target && target < sorted[r].num) {
> 			return l;
> 		} else if (sorted[r].num <= target) {
> 			return r;
> 		} else /* (target < sorted[l].num) */ {
> 			return -1;
> 		}
> 	}
>
> 	int getDistance(vector<Elem> &sorted, vector<int> &lift, int maxDiff, int l, int r) {
> 		if (l == r) {
> 			return 0;
> 		}
>
> 		if (sorted[r].num - sorted[l].num <= maxDiff) {
> 			return 1;
> 		}
>
> 		int distance = 0;
> 		while (sorted[r].num - sorted[l].num > maxDiff) {
> 			l = lift[l];
>
> 			if (l == -1) {
> 				return -1;
> 			}
>
> 			distance++;
> 		}
>
> 		return distance + 1;
> 	}
> public:
> 	vector<int> pathExistenceQueries(int n, vector<int>& nums, int maxDiff, vector<vector<int>>& queries) {
> 		vector<Elem> sorted(n);
> 		vector<int> sortmap(n);
> 		vector<int> lift(n);
> 		vector<int> ret(queries.size());
>
> 		for (int i = 0; i < n; i++) {
> 			sorted[i].idx = i;
> 			sorted[i].num = nums[i];
> 		}
>
> 		sort (sorted.begin(), sorted.end());
>
> 		for (int i = 0; i < n; i++) {
> 			sortmap[sorted[i].idx] = i;
> 		}
>
> 		for (int l = 0; l < n - 1; l++) {
> 			lift[l] = findUpperBound(sorted, sorted[l].num + maxDiff, l + 1, n - 1);
> 		}
> 		lift[n - 1] = n - 1;
>
> 		for (int i = 0; i < queries.size(); i++) {
> 			ret[i] = getDistance(sorted,
> 								 lift,
> 								 maxDiff,
> 								 MIN(sortmap[queries[i][0]], sortmap[queries[i][1]]),
> 								 MAX(sortmap[queries[i][0]], sortmap[queries[i][1]]));
> 		}
>
> 		return ret;
> 	}
> };
> ```

- 정렬된 상태에서 destination 까지 가기 위해 `maxDiff` 만큼 움직였을 때 갈 수 있는 최대값을 binary search 로 찾아보았다.
- 결과는 timeout 떡락.