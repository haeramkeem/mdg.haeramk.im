---
tags:
  - mdg
  - algorithm
  - interview/retry
  - dijkstra
date: 2026-07-03
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/network-delay-time)

> [!tip] 요약
> - [[Dijkstra (Algorithm)|다익스트라]] 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260703092839.png]]

- [[Dijkstra (Algorithm)|다익스트라]] 를 떠올릴 수 있다면, 푸는거 자체는 그렇게 어렵지 않다.
	- 다익스트라로 각 노드의 최소도달비용을 다 구하고, 이 최소도달비용의 최대치만 마지막에 구해주면 된다.

```cpp
#define MAX_INT (0x7FFFFFFF)

#define SRC_IDX (0)
#define DST_IDX (1)
#define TIME_IDX (2)

struct NodeInfo {
	int node;
	int cost;

	bool operator<(const NodeInfo &others) const {
		// Lower cost is better
		return cost > others.cost;
	}
};

class Solution {
public:
	int networkDelayTime(vector<vector<int>>& times, int n, int k) {
		map<int, vector<NodeInfo>> conn;
		vector<int> cost(n, MAX_INT);
		priority_queue<NodeInfo> pq;
		int max_cost = -1;

		// Build connection info
		for (auto &t : times) {
			conn[t[SRC_IDX] - 1].push_back({t[DST_IDX] - 1, t[TIME_IDX]});
		}

		// Dijkstra
		cost[k - 1] = 0;
		pq.push({k - 1, 0});

		while (!pq.empty()) {
			auto cur = pq.top();

			for (auto &next : conn[cur.node]) {
				if (cost[next.node] > cost[cur.node] + next.cost) {
					cost[next.node] = cost[cur.node] + next.cost;
					pq.push({next.node, cost[next.node]});
				}
			}

			pq.pop();
		}

		// Get max cost
		for (auto c : cost) {
			if (c == MAX_INT) {
				return -1;
			} else if (max_cost < c) {
				max_cost = c;
			}
		}

		return max_cost;
	}
};
```
