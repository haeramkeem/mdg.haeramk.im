---
tags:
  - mdg
  - algorithm
  - interview/retry
  - mapset
date: 2026-08-13
aliases:
  - LeetCode 3310
  - LeetCode 3310. Remove Methods From Project
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/remove-methods-from-project)

> [!tip] 요약
> - BFS

## 최종

> [!info]- 결과
> ![[Pasted image 20260813102922.png]]

- BFS 로 suspicious group 찾고 그 안에 있는 애들이 다른 group 에 의해 call 되는지 찾으면 된다.
- 근데 성능이 넘 구림; 나중에 한번 더 풀어보면서 최적화하자.

```cpp
class Solution {
	vector<int> remove_nothing(int n) {
		vector<int> ret(n);

		for (int i = 0; i < n; i++) {
			ret[i] = i;
		}

		return ret;
	}

	vector<int> remove_suspicious(int n, vector<bool> &suspicious) {
		vector<int> ret;

		for (int i = 0; i < n; i++) {
			if (!suspicious[i]) {
				ret.push_back(i);
			}
		}

		return ret;
	}
public:
	vector<int> remainingMethods(int n, int k, vector<vector<int>>& invocations) {
		vector<bool> suspicious(n, false);
		vector<vector<int>> invoc_dst(n);
		vector<vector<int>> invoc_src(n);
		queue<int> q;

		for (auto &i : invocations) {
			invoc_dst[i[0]].push_back(i[1]);
			invoc_src[i[1]].push_back(i[0]);
		}

		suspicious[k] = true;
		q.push(k);
		while (!q.empty()) {
			int cur = q.front();

			for (int i : invoc_dst[cur]) {
				if (!suspicious[i]) {
					suspicious[i] = true;
					q.push(i);
				}
			}

			q.pop();
		}

		for (int s = 0; s < n; s++) {
			if (suspicious[s]) {
				for (int i : invoc_src[s]) {
					if (!suspicious[i]) {
						return remove_nothing(n);
					}
				}
			}
		}

		return remove_suspicious(n, suspicious);
	}
};
```
