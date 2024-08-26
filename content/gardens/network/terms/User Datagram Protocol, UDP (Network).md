---
tags:
  - terms
  - network
date: 2024-05-27
---
## 란?

- L4 프로토콜로, 다음과 같은 특징이 있다:
	- *Connectionless*: 데이터의 누락 혹은 순서를 보장하지 않음
	- *Unreliable*: Flow & Error control 을 보장해주지 않음
	- *Datagram-oriented*: 상위계층에서 내려온 메세지별로 송신
- 이렇게만 보면 안좋은 점만 있지만, 대신 빠르다고 한다.
	- 근데 실제로 벤치마크 돌려보면 [[Transmission Control Protocol, TCP (Network)|TCP]] 와 별 다를 바 없다고 하긴 하더라 (어디선가 주워들은 얘기다. 신뢰하지는 말것)