---
tags:
  - mdg
  - network
  - l3-network-layer
  - packet-switch
date: 2026-07-18
aliases:
  - Packet Switch
  - Router
  - 라우터
---
> [!info] 작물단계: #seed

> [!info]- 참고한 것들
> - [[02. Network Layer|충남대 김상하 교수님 컴퓨터네트워크 강의 (Fall 2021)]]

## 란?

- *Packet Switch* 는 한 회선의 input queue 로 들어온 packet 을 다른 회선의 output queue 로 옮겨주는 것을 의미한다.
- 그리고 이런짓을 하는 장비를 *Router* (*라우터*) 라고 한다.

### 예시

![%E1%84%8B%E1%85%B5%E1%84%85%E1%85%A9%E1%86%AB02%20-%20Network%20Layer%20c838e9f353ea4739a7de8281a9e81ba1/image2.png](gardens/network/originals/comnet.fall.2021.cse.cnu.ac.kr/images/02_c838e9f353ea4739a7de8281a9e81ba1/image2.png)

- 예시 네트워크가 왼쪽 그림과 같고, 이때의 2번 라우터의 내부 모습이 오른쪽 그림이다.
- 이때 1번 라우터로부터 한 packet 이 도착해 지금 input queue 에 있다고 해보자. 이놈의 source 는 `B` 이고, destination 은 `D` 이다.
- 왼쪽 그림을 보면 2번 라우터에서 3번 라우터로 보내면 이 packet 을 `D` 로 보낼 수 있다는 것을 알 수 있다. 이것을 2번 라우터도 이미 알고 있고, 그래서 packet 을 3번 라우터로 나가는 output queue 로 옮긴다.
- 이 과정을 *Packet Switch* 라고 하는 것이다.

## 종류

- *Packet Switch* 를 해서 패킷을 목적지까지 보내는 방법은 대표적으로 두가지가 있다.
	- [[Datagram (Packet Switch)|Datagram]]
	- [[Virtual Circuit (Packet Switch)|Virtual Circuit]]