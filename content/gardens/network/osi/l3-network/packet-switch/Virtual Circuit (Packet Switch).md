---
tags:
  - mdg
  - network
  - l3-network-layer
  - packet-switch
date: 2026-07-18
aliases:
  - Virtual Circuit
---
> [!info] 작물단계: #seed

> [!info]- 참고한 것들
> - [[02. Network Layer|충남대 김상하 교수님 컴퓨터네트워크 강의 (Fall 2021)]]

## 란?

- *Virtual Circuit* 은 ==경로를 미리 결정한 다음 그 경로대로 packet 이 움직이도록 하는== 방법이다.
- Packet 들이 그 경로대로만 움직이기 때문에 packet 도착 순서는 반드시 출발 순서와 같다. 즉, *Virtual Circuit* 의 경우에는 ==도착순서가 보장된다==.
	- 반대로 [[Datagram (Packet Switch)|Datagram]] 은 경로를 결정하지 않고 그냥 막 보낸다. 그래서 이놈은 도착 순서가 보장되지 않는다.
- 이때 '경로를 미리 결정' 하기 위해 control packet 을 먼저 보내고, 이렇게 해서 경로가 결정되면 각 [[Packet Switch (L3 Network Layer)|Router]] 들은 그 경로대로만 [[Packet Switch (L3 Network Layer)|Packet Switch]] 을 수행한다. 그리고 packet 이 전부 이동했으면 마지막으로 control packet 을 한번 더 보내 그 경로를 폐기한다.
	- 이렇게 '경로를 결정하는 것' 을 *Connection* 이라고 한다.
		- 그래서 *Virtual Circuit* 의 경우에는 ==Connection-oriented== 라고 부르고, Datagram 은 Connectionless 라고 한다.
	- 그래서 처음에 보내는 control packet 은 'connection packet' 이라고 부르고, 마지막에 보내는 control packet 은 'disconnect packet' 이라고 부른다.