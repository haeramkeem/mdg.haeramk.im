---
tags:
  - mdg
  - network
  - osi
  - l7-application
  - ospf
date: 2026-07-18
aliases:
  - OSPF
  - Open Shortest Path First
---
> [!info] 작물 단계: #seed 

## 란?

- 대표적인 [[Interior Gateway Protocol, IGP (Network)|IGP]] 프로토콜이다.
- [[Routing Information Protocol, RIP (Network)|RIP]] 가 무지성 방법론이었다면, *OSPF* 는 좀 더 세련된 방법을 쓴다.
	1. 우선 *Link State* 를 갖고 있다. 이건 단순히 '누가 누구랑 연결돼있다' 가 아니고, 누구랑 연결되어있는지, 연결 비용 (뭐 지연 시간 등) 은 어떤지 등등에 대한 정보이다.
	2. 그리고 이 *Link State* 를 이용해서, 경로를 계산할 때는 [[Dijkstra (Algorithm)|Dijkstra]] 를 사용한다.
	3. RIP 에서는 30초마다 라우팅테이블을 전파해서 갱신했지만, *OSPF* 에서는 *Link State* 에 변화가 생길때마다 전파한다.
- 그래서 이 방법은 대규모 네트워크에서 사용한다고 한다.