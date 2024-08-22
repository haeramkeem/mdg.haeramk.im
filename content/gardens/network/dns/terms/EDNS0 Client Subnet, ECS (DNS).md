---
tags:
  - 용어집
  - network
  - dns
date: 2024-05-27
---
> [!info]- 참고한 것들
> - [[6. DNS#DNS|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]
> - [RFC7871](https://datatracker.ietf.org/doc/html/rfc7871)

## 소개

- [[Domain Name System (DNS)|DNS]] 의 확장팩에 들어있는 기능이다.
- Client 가 멀리 있는 [[Nameserver (DNS)|DNS resolver]] 에 질의를 했을 때 이놈은 authoritative nameserver 의 정보를 알려줄 텐데
- 이놈은 DNS resolver 와 가까이 있는 nameserver 정보를 알려줄 것이므로 DNS resolver 가 client 에게 이 정보를 전달하게 되면 client 는 멀리있는 nameserver 에 보내야 할 것이다.
- 이것을 해결하기 위해 client 의 subnet 으로 client 와 가까이 있는 nameserver 를 알아내어 응답하는 기능이다.
- 근데 client 위치가 노출되기 때문에 privacy 문제가 있어 요즘은 사용하지 않는다고 한다.