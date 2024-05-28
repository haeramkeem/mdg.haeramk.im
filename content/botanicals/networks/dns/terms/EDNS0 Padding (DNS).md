---
tags:
  - 용어집
  - Network
  - DNS
date: 2024-05-27
---
> [!info]- 참고한 것들
> - [[6. DNS#DNS|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]
> - [RFC7830](https://datatracker.ietf.org/doc/html/rfc7830)

## 소개

- [[Domain Name System, DNS (DNS)|DNS]] 의 확장팩 기능 중 하나이다.
- 기본적으로 plain text 를 기반으로 하는 DNS 생태계에서 보안을 위해 암호화를 하는 [[DNS over Encryption (DNS)|DNS-over]] 이 제시되었는데,
- 암호화를 해도 패킷의 길이를 보고 domain 을 어느정도 때려맞추는 것이 가능하다고 알려지자, DNS packet 의 길이를 일정하게 맞춰 encryption 했을때 때려맞출 수 없게 해주는 기능이다.