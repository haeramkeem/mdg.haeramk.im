---
tags:
  - terms
  - network
  - bgp
date: 2024-05-26
---
> [!info]- 참고한 것들
> - [[3. BGP|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]

## AS, Autonomous System, 자율 시스템

- 동일한 routing policy (protocol) 를 따르는 네트워크의 집합
- 인데, 간단하게 생각하면 그냥 한 기관이라고 생각하면 된다.
	- 하나의 기관은 하나의 내부 관리 조직에 의해 동일한 routing policy (protocol) 를 사용하여 관리되는 경우가 많기 때문
	- 가령 SNU 처럼 하나의 학교일 수도 있고, [[Internet Service Provider, ISP (Network)|ISP]] 도 AS 를 운영한다.

> [!tip] 주의 - 그렇다고 기관과 AS 가 동의어라는 것은 아니다.
> - 하나의 기관이 여러 AS 를 운용하는 경우도 있다.
> - 그냥 이해의 편의를 위한 한 예시로 AS 를 기관으로 생각하면 좋다는 것.

- 각 AS 는 *AS Number (ASN)* 이라는 고유한 식별자로 구분되며, AS 가 자율적으로 운용할 수 있는 IP addr block 을 갖게 된다.
	- 저 ASN 과 IP addr block 은 모두 인터넷 생태계에서 자원이므로, 이것은 [[Internet Registry System (Network)]] 와 같은 곳으로부터 할당받는다.

## Provider/Customer

- 이렇게 말하면 AS 가 모두 평등한 위치에 있는 것처럼 보이지만, 그렇지는 않고 AS 들 간에는 계층적인 구조를 가진다.
- 모든 [[Border Gateway Protocol (BGP)|AS 간에 통신]]이 가능하게 하기 위해서 일단 서로간의 통신을 다 뚫어놓는 방법을 생각할 수 있다.
- 근데 딱봐도 이건 너무 힘들어보인다.
	- 그럼 만약에 AS 가 추가되면 그 AS 는 기존의 모든 AS 와 연결해야 되자네?
- 그래서 만약에 서로서로 연결된 AS 들 간의 망이 기존에 있다면, 새로운 AS 는 그냥 그 중 하나의 AS 와만 연결하면 그놈을 거처서 다른 AS 와도 통신이 가능할 것이다.
	- 가령 예를 들면 우리나라의 ISP 들 (KT, SKT, LGU) 은 다른 나라의 여러 ISP 들 (뭐 일본의 Softbank 나 미국의 AT&T) 들과 통신을 뚫어놓는다. (아마?)
	- 그럼 SNU 의 경우에는 우리나라의 ISP 중 하나와만 통신을 뚫는식으로 다른나라와도 통신이 가능하게 할 수 있다.

> [!tip] 참고 - 하나의 ISP 와만 연결해야하는 것은 아니다.
> - 하나만 연결해도 통신이 가능하지만, HA 이나 부하분산 등의 이유로 다른 ISP 와도 연결을 하는 경우가 많다.
> - 이러한 것을 [[Multi Homing (BGP)|Multi-homing]] 이라고 한다.

- 이런식으로 AS 는 *Provider* (가령 ISP), *Customer* (가령 그 ISP 에 연결된 기관) 계층화가 이루어 진다.
	- Provider 는 *Upstream* 으로도 표현되기도 한다.

## Packets between ASes

![[Pasted image 20240526144533.png]]

- Egress traffic: AS 를 나가는 패킷
- Ingress traffic: AS 로 들어오는 패킷
    - 두정도로 나눠볼 수 있다
        - 해당 AS 안의 host 로 가기 위한 패킷
        - 해당 AS 를 거쳐가기 위한 패킷
- 한 AS 는 패킷 route 규칙을 정하기 위해, 인접한 AS 들과 통신하며 서로의 IP prefix 정보를 공유한다.
	- 이렇게 공유하는 것을 Announce 라고 하며
    - 그리고 이러한 Announce 를 받은 AS 는 이것을 Accept 해야 한다
    - 이렇게 공유된 내용에 따라 packet 이 해당 AS 로 route 된다

## Routing policies for ASes

- AS 들 간에 routing 을 하는 것은 그냥 인접한 AS 의 announcement 를 이용해 자동으로 rule 을 정하는것 만은 아니다.
- 각 기관의 상황에 따라 인접한 AS 로 패킷을 보낼지 말지 static 하게 설정하는 것도 필요하다.
- 아래 예시를 생각해 보자.
    - 가령 SNU 에서 SK Broadband 에 있는 어떤 놈한테 패킷을 보낼 때
    - SNU 는 인접한 KT 를 통해서 SKB 에 보낼 수도 있고
    - 또 인접한 YS 를 통해서 SKB 에 보낼 수도 있지만
    - YS 는 SKB 에 연결은 되어 있어도 SNU 의 패킷을 SKB 로 보내주지 않을 수도 있다
        - 왜냐면 YS 는 SNU 의 provider 가 아니기 때문에 (ISP 도 아니고 SNU 가 YS 에 돈을 준 것도 아니기 때문에)
        - YS 가 SNU 의 패킷을 라우팅을 해줘야 할 의무는 없기 때문