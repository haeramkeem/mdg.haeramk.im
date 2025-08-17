---
tags:
  - terms
  - network
  - bgp
date: 2023-02-02
aliases:
  - Interior Gateway Protocol
  - IGP
---
> [!info]- 참고한 것들
> - [[3. BGP|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]

## 란?

- [[Autonomous System, AS (BGP)|AS]] 내부의 통신을 가능하게 해주는 프로토콜을 통칭
- [[Open Shortest Path First, OSPF (Network)|OSPF]] 가 대표적이고, [[Routing Information Protocol, RIP (Network)|RIP]] 등 여러개 더 있다.

## 인터넷에서 패킷이 전송되는 과정

- 인터넷에서 패킷이 전송되는 것을 이 AS 개념을 비벼서 생각해 보면
	1. 일단 AS 내의 어떤 놈이 패킷을 보낼거다.
	2. 그럼 그놈이 속한 [[Local Area Network, LAN (Network)|LAN]] 에서부터 라우터들을 거쳐 [[Autonomous System, AS (BGP)|Boundary Router]] 로 알아서 찾아갈거다.
	3. 그럼 패킷은 Boundary Router 에서 다른 AS 의 Boundary Router 로 이동하다가 수신지 주소에 대한 AS 를 만나면 드가게 되고
	4. 그 다음은 AS 내에서 알아서 찾아가게 될 것이다.
- 근데 위에 비빔박자로 비벼진 설명을 보면 이상한게 두개 있다.
	1. 첫째는 "알아서 찾아갈거다" 부분이다: 어케했노?
	2. 둘째는 Boundary Router 에서 Boundary Router 로 전송되는 부분이다: 어케했노?
- 첫번째 경우에 대한 프로토콜이 **IGP(Interior Gateway Protocol)** 가 되는 것이다.
	- 즉, 위에서 말한 것 처럼 하나의 AS 내에서 라우터들 간의 통신을 명세한 것
- 그리고 두번째 경우에 대한 프로토콜을 [[External Gateway Protocol, EGP (BGP)|External Gateway Protocol, EGP]] 라고 한다
	- 이건 AS 의 Border Gateway 간 통신을 명세한 것으로 [[Border Gateway Protocol (BGP)|BGP]] 가 대표적이다.