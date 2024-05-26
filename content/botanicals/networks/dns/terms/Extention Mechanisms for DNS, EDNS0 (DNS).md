---
tags:
  - 용어집
  - Network
  - DNS
date: 2024-05-27
---
> [!info]- 참고한 것
> - [[6. DNS#DNS|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]
> - [RFC6891](https://datatracker.ietf.org/doc/html/rfc6891)

## 개요

- [[Domain Name System, DNS (DNS)|DNS]] 는 53/[[User Datagram Protocol, UDP (Network)|UDP]] 를 사용하기 때문에 페킷의 사이즈가 512byte 로 제한되어 있고, 이것은 너무나 불편하다.
- 물론 [[Domain Name System, DNS (DNS)|Truncate]] 옵션으로 TCP