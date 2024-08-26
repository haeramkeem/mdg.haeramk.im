---
tags:
  - 용어집
  - network
  - bgp
date: 2024-05-24
---
> [!info]- 참고한 것들
> - [[5. RPKI, BGPSEC#1. Route hijack (IP prefix hijack)|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]

## 개요

- [[Border Gateway Protocol (BGP)|BGP]] 프로토콜의 문제점 중 하나.

## 시나리오

![[Pasted image 20240525111846.png]]

- 여기서 AS4 가 진짜이고 AS5 가 attacker 라고 할 때
- 쟤네 둘 다 Prefix `P` 를 가지고 있다고 전파할 경우 위 그림에서 보는 것처럼 AS1 은 AS4 로부터 온 `AS_PATH: 2 4` 메세지와 AS5 로부터 온 `AS_PATH: 3 5` 메세지를 받게 된다
- 근데 BGP 에서는 Provider 보다는 Customer 가 보낸 메세지를 더 신뢰하기 때문에 AS5 가 보낸 메세지를 신뢰하게 되고,
	- AS 에서의 provider, customer 는 예를 들면 KT 와 SNU 를 생각하면 된다 - 각각이 AS 이지만 서비스 제공자와 소비자가 있는 것
	- 그림에서 위쪽에 있는 놈이 provider 이고 아래쪽은 customer 이다.
- 따라서 AS4 로 가야 하는 `P` prefix 를 가진 메세지가 AS5 로 가게 된다