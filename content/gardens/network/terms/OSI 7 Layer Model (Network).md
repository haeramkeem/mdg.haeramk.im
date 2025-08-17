---
tags:
  - terms
  - network
date: 2023-02-02
aliases:
  - OSI 7 Layer Model
  - OSI 7 Layer
---
## 란?

- 일단 네트워크라는 것은 아주 방대한 영역이기 때문에 이걸 좀 세분화해서 연구를 할 필요가 있었댄다
- 따라서 *OSI (Open System Interconnection Model)* 7계층 모델이라는 것을 도입하게 됐는데
- 이게 필요한 이유는 다음과 같다
    - 일단 계층적으로 나뉘어있기 때문에 문제가 발생했을 때 어느 계층에서 문제가 발생했는지 확인하기가 쉬워진다
    - 또한 특정 계층에 대해서만 집중하여 연구 혹은 개발할 수 있다 - 다른 계층에 대한 전문적인 이해 없이도 연구 혹은 개발할 수 있기 때문
- 뭐 간단하게만 복기하고 넘어가면
    - L1: *Physical Layer*
	    - 바이트 스트림의 전송에 발생할 수 있는 물리적인 에러들을 최소화 하는 것에 초점이 맞춰진 계층
    - L2: *Data Link Layer*
	    - Hop-to-hop 통신에서의 reliability 를 보장하는 계층. 두가지 Sub-layer 가 존재한다.
	        - LLC (Logical Link Control): 보통 에러 탐지 와 복구(ARQ 재전송 등을 통해서) 서비스인 DLC (Data Link Control) 을 제공해주는 서브레이어
	        - MAC (Multi Access Control): LAN 환경에서 회선 하나에 한번에 하나의 패킷만 송수신되도록 하여 패킷간의 충돌이 일어나지 않게 해주는 서브레이어
    - L3: *Network Layer*
	    - End-to-end 통신에서의 routing 을 담당하는 계층
    - L4: *Transport Layer*
	    - Process-to-process 통신과 ([[Transmission Control Protocol, TCP (Network)|TCP]]의 경우) Queue overflow 를 방지해 Reliability 를 제공해주는 계층
    - L5: S*ession Layer*
	    - 보안(암복호화) 를 제공해주는 계층
    - L6: *Presentation Layer*
	    - 데이터의 표현방식 (뭐 ASCII 랄지 MIME 이랄지) 에 대한 서비스를 제공해주는 계층
    - L7: *Application Layer*
	    - 사용자와 가장 밀접한 서비스를 제공하는 계층