---
tags:
  - os
  - os-distributed
aliases:
  - CURP
date: 2024-11-12
---
> [!info]- 참고한 것들
> - [Exploiting Commutativity For Practical Fast Replication, NSDI'19](https://www.usenix.org/conference/nsdi19/presentation/park)
> - [CNCF XLine blog posting](https://www.cncf.io/blog/2023/09/20/the-introduction-to-the-curp-protocol/)

> [!info] 원본 논문
> - 이 글은 [Exploiting Commutativity For Practical Fast Replication, NSDI'19](https://www.usenix.org/conference/nsdi19/presentation/park) 에서 핵심 아이디어만 요약한 글입니다.
> - 별도의 명시가 없으면, 본 논문에서 그림을 가져왔습니다.

## Commutative Replication

- 일단 기존의 [[Viewstamped Replication Protocol, VR (Distributed Computing)|VR]], [[Paxos (Distributed Computing)|Paxos]], [[Raft Algorithm (Distributed Computing)|Raft]] 와 같은 애들은 전부 distributed environment 에서 "실행 순서에 대한 consensus" 를 맞추기 위해 2-RTT 를 필요로 했다.
	- 이들의 공통점은 client-leader 간의 통신이랑, leader-follower 간의 통신 총 두번의 RTT 가 필요하다는 것이다.
- 이 