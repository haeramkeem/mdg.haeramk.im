---
tags:
  - terms
  - network
  - bgp
date: 2024-05-26
aliases:
  - Route Leak
---
> [!info]- 참고한 것들
> - [[5. RPKI, BGPSEC#2. Route leak||서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]

## 개요

- [[Border Gateway Protocol (BGP)|BGP]] 프로토콜의 문제점 중 하나.

## 시나리오

![[Pasted image 20240525121856.png]]

- [[Route Hijack Attack (BGP)|Route hijack]] 은 AS 가 ==악의적==으로 잘못된 IP prefix 를 전파하여 패킷을 ==가로챈== 것이라면,
- Route leak 의 경우에는 AS 가 ==실수로== 잘못된 IP prefix 를 전파하여 트래픽이 ==우회==되는 상황을 의미한다.
- 위의 예시를 보자.
- AS4 가 보낸 `Prefix: P` 메세지는 AS5 입장에서는 Provider 가 준 메세지이기 때문에 이것을 전파하면 안된다.
- 하지만 AS5 의 관리자 실수로 인해 이것을 전파하게 되면 AS1 은 AS4 가 보낸 메세지와 AS5 가 보낸 메세지를 모두 받게 되는데
- 이때도 역시나 provider 보다는 customer 의 메세지를 더 신뢰해서 AS1 는 해당 IP prefix 에 대해 AS5 를 거치는 route 로 보내게 된다.
- 그러면 더 짧은 경로가 있는데도 더 긴 경로가 선택되는 것이기에 패킷 전달이 지연되는 것.