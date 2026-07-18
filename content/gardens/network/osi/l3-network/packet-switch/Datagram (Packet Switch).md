---
tags:
  - mdg
  - network
  - l3-network-layer
  - packet-switch
date: 2026-07-18
aliases:
  - Datagram
---
> [!info] 작물단계: #seed

> [!info]- 참고한 것들
> - [[02. Network Layer|충남대 김상하 교수님 컴퓨터네트워크 강의 (Fall 2021)]]

## 란?

- *Datagram* 은 간단히 말하면 그냥 막 패킷을 보내는거다.
- 원본 payload 를 packet 으로 나눠 보낼 때, 각 packet 들이 어떤 경로로 가던지 상관하지 않는 방식을 말한다.
- 그래서 어떤건 먼저 도착하고 어떤건 나중에 도착하는데, 그렇게 해서 전부 도착한 다음에는 packet header 에 있는 sequence number 를 가지고 정렬해서 원본 payload 를 만든 다음에 상위계층으로 올려보낸다.
	- 즉, ==Datagram 에서는 도착순서가 보장되지 않는다==.
- 그리고 *Datagram* 은 ==Connectionless== 라고 한다.
	- [[Virtual Circuit (Packet Switch)|Virtual Circuit]] 의 경우에는 도착순서를 보장하기 위해 control packet 을 먼저 날려서 경로를 확정한 다음 그 경로대로 데이터가 움직인다. 이렇게 경로를 확정하는 것을 'Connection' 이라고 한다.
	- 근데 *Datagram* 에서는 도착순서를 보장하지 않아도 되기 때문에 connection 을 할 필요가 없다. 그래서 *Connectionless* 인 것.
- 대표적으로 [[Internet Protocol, IP (L3 Network Layer)|IP]] 가 이런 방식을 사용한다.