---
tags:
  - mdg
  - algorithm
  - graph
  - terms
  - dijkstra
date: 2026-07-03
aliases:
  - Dijkstra
  - 다익스트라
---
> [!tip] 이놈을 사용하는 코테문제
> - 본 작물의 backlink를 확인하거나
> - #dijkstra 태그로 검색해보자.

> [!tip] 언제 Dijkstra 을 사용해야 할까?
> - 우선 Dijkstra 는 [[Floyd-Warshall (Algorithm)|Floyd-Warshall]] 보다는 시간복잡도가 작다. 그래서 노드의 수가 많을 때도 사용가능하다.
> - 그리고 Dijkstra 는 한 노드에 대한 나머지 노드의 최소도달시간을 구한다. 그래서 그냥 "출발지가 정해진 최단경로 계산" 문제라면 Dijkstra 를 먼저 떠올려봄즉하다.

## Problem

- Dijkstra 알고리즘이 풀려고 하는 문제는 "최단경로 계산" 이다.

## Condition

- 이 알고리즘을 적용할 수 있는 조건은 "음수 가중치" 가 없어야 한다는 것이다.

## TL;DR

> [!info] 이 TL;DR 이 이해가 안된다면, 아래 [[#레전드 친절한 설명|레전드 친절한 설명]] 을 보시라.

1. 다음과 같은 자료구조를 준비하자.
	- `{node, cost}` 로 구성된 구조체 `NodeInfo`
	- 노드 연결 정보: `map<node, vector<NodeInfo>>`
		- 이 map 은 source node 를 넣으면 이 노드와 '직접적으로' 연결된 다른 노드들이 `vector<NodeInfo>` 형태로 나오게 되도록 초기에 빌드한다.
	- 각 노드로 가는 cost 를 실시간 추적하기 위한 vector: `vector<cost>`
		- 초기에는 출발지 제외 전부 infinite 로 초기화
	- Dijkstra 는 BFS 처럼 작동하되, 우선순위큐를 사용해서 BFS 의 queue 가 cost 가 작은순서대로 pop 할 수 있도록 한다: `priority_queue<NodeInfo>`
		- 초기에는 출발지만 넣어놓는다.
2. 우선순위큐가 비어있지 않는 한, 다음의 과정을 반복한다.
	1) 우선순위큐에서 하나를 꺼낸다 (현재 노드).
	2) 이 현재 노드와 '직접적으로' 연결된 다음 노드를 전부 확인하면서:
		- (A): 현재 노드에 대한 cost (실시간 cost 기준) + 다음 노드 로 움직이는 cost (노드 연결 정보 기준)
		- (B): 다음 노드 에 대한 cost (실시간 cost 기준)
		- (A) 가 (B) 보다 작으면, '다음 노드' 로 가는 더 빠른 경로를 발견한 것. 따라서 (A) 로 '다음 노드' 에 대한 실시간 cost 를 업데이트해주고, '다음 노드' 와 이 cost 를 우선순위큐에 넣는다.
- 위 내용을 가지고 짠 코드이다:

```cpp
#define MAX_INT (0x7FFFFFFF)

struct NodeInfo {
	int node;
	int cost;

	bool operator<(const NodeInfo &others) const {
		// Lower cost is better
		return cost > others.cost;
	}
};

void Dijkstra(vector<vector<int>>& edges, int num_nodes, int begin_node) {
	// Node connection info
	map<int, vector<NodeInfo>> conn;

	// Node cost tracker
	vector<int> cost(num_nodes, MAX_INT);

	// PQ BFS
	priority_queue<NodeInfo> pq;

	// Build connection info
	for (auto &e : edges) {
		conn[e[0] /* src node */].push_back({e[1] /* dst node */, e[2] /* edge cost */});
	}

	// Dijkstra
	cost[begin_node] = 0;
	pq.push({begin_node, 0});

	while (!pq.empty()) {
		// Get current node
		auto cur = pq.top();

		// For all connected nodes
		for (auto &next : conn[cur.node]) {
			// (A): cost[cur.node] + next.cost
			// (B): cost[next.node]
			if (/* (A) */ cost[cur.node] + next.cost < /* (B) */ cost[next.node]) {
				cost[next.node] = cost[cur.node] + next.cost;
				pq.push({next.node, cost[next.node]});
			}
		}

		pq.pop();
	}

	// (Debug) Print final node costs
	for (int c : cost) {
		cout << c << endl;
	}
}

```

## 레전드 친절한 설명

> [!warning]- 본 글은 #draft 상태입니다.
> - [ ] 그림 추가
> - [ ] 예제 코드 추가
