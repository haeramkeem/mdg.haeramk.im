---
tags:
  - mdg
  - network
  - osi
  - l7-application
  - rip
date: 2026-07-18
aliases:
  - RIP
  - Routing Information Protocol
---
> [!info] 작물 단계: #seed 

## 란?

- 대표적인 [[Interior Gateway Protocol, IGP (Network)|IGP]] 프로토콜이다.
- 장점은 작동방식이 매우 단순하다는 것이다.
	- [[Packet Switch (L3 Network Layer)|라우터]] 간의 통신 비용은 고려하지 않고, 그냥 hop 수 (라우터 하나 지날때마다 +1) 만 가지고 최적의 경로를 계산한다.
	- 약 30초라는 주기를 가지고 자신이 가진 라우팅 테이블을 주변에 [[Broadcast (Network)|Broadcast]] 로 쏴서 주변의 라우터들의 정보를 갱신한다.
- 따라서 단점은:
	- 라우터 간의 비용은 고려하지 않는다.
	- 라우팅 테이블을 주기적으로 broadcasting 하기 때문에 네트워크 대역폭을 많이 먹는다.
- 그래서 소규모 네트워크에서만 사용된다고 한다.