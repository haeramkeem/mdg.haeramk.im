---
tags:
  - 용어집
  - Network
date: 2024-05-26
---
> [!info]- 참고한 것들
> - [Difference Between CIDR and VLSM (with Comparison Chart, Example and Merits) - Tech Differences](https://techdifferences.com/difference-between-cidr-and-vlsm.html)
> - [CIDR(Classless Inter Domain Routing) 이란?](https://algopoolja.tistory.com/97)

## 란?

- CIDR 은 많이 들었을텐데
- 일단 이놈을 이해하는데 핵심은 그냥 단순한 표현법이 아니라는 것이다
    - 뭐 블로그같은데 보면 `/24` 표현법을 마치 CIDR 의 전부인거마냥 설명해놨는데
    - 그렇지 않더라
- CIDR 의 정곡을 찌르는 핵심은 다음과 같다
    - Classless 이다
        - 하지만 CIDR 을 그냥 Classless IP 표현법이라고 생각하면 [[Variable Length Subnet Mask, VLSM (Network)|VLSM]] 이랑 헷갈림
    - Inter-Domain 이다
        - 즉, 하나의 네트워크 내에서의 서브넷을 위한 개념이 아닌 네트워크 간의 통신을 위해 등장한 개념이다 이거임
        - Domain, 네트워크 이런건 AS 와 동의어로 생각해도 좋다
    - Subnetting 이 아닌 Supernetting 이다
        - 즉, 쪼개는 개념이 아니라 합치는 개념이다
- 그래서 CIDR 가 등장한 배경은 이렇다
    - [[Border Gateway Protocol, BGP (BGP)|BGP]] 으로 [[Autonomous System, AS (BGP)|AS]] 간 통신을 할때 Border Gateway 는 자신이 속한 AS 의 라우팅 정보를 옆에놈한테 넘겨야되는데
    - AS 안에는 다양한 서브넷이 있으니까 이것을 모두 알려주기에는 오버헤드가 너무 크다 이말이야
    - 그래서 `IP/SUBNET_LEN` 의 형태로 서브넷들을 요약정리해서 옆에놈에게 알려주기 위한 것이 CIDR 이다
    - 이렇게 하면 AS 안의 다양한 서브넷들의 하나의 `IP/SUBNET_LEN` 문자열로 정리되기 때문에 통신의 오버헤드가 적어지고 좋더라
- 그래서 `IP/SUBNET_LEN` 을 CIDR 표현법이라 한다.
    - 뭐 우분투에서 Static ip 설정할때 그냥 `192.168.1.10` 이렇게만 적으면 CIDR 포맷이 아니라고 에러가 나거나
    - Kubeadm 사용할때 서비스 혹은 파드의 IP 범위를 명시할때 CIDR 포맷으로 적어주는등
    - CIDR 의 개념과는 무관하게 그냥 IP 의 범위 혹은 IP 와 서브넷 마스크를 같이 표현하려할 때 CIDR 을 사용하긴 한다