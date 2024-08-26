---
tags:
  - 용어집
  - network
  - bgp
date: 2024-05-26
---
> [!info]- 참고한 것들
> - [[3. BGP|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]

## 란?

- [[Autonomous System, AS (BGP)|AS]] 들 간의 통신을 가능하게 해주는 프로토콜을 통칭
- 인데, 현재로서는 [[Border Gateway Protocol (BGP)|BGP]] 밖에 없다.
- AS 들 간에 routing 정보를 공유하여 routing rule 을 정하는 식으로 작동하며
- [[Interior Gateway Protocol, IGP (Network)|IGP]] 와는 독립적이다.
- IGP 같은 경우에는 AS 내의 router 들을 자동으로 잡아내지만 EGP(BGP) 의 경우에는 어떤 router 와 peering 을 할 것인지 명시적으로 static config 해야 한다.