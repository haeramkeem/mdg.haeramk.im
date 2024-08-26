---
tags:
  - terms
  - network
  - dns
date: 2024-05-27
---
> [!info]- 참고한 것들
> - [[6. DNS#DNS|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]
> - [RFC6891](https://datatracker.ietf.org/doc/html/rfc6891)
> - [위키](https://en.wikipedia.org/wiki/Extension_Mechanisms_for_DNS)

## 개요

- [[Domain Name System (DNS)|DNS]] 는 53/[[User Datagram Protocol, UDP (Network)|UDP]] 를 사용하기 때문에 페킷의 사이즈가 512byte 로 제한되어 있고, 이것은 너무나 불편하다.
- 물론 [[Domain Name System (DNS)|Truncate]] 옵션으로 [[Transmission Control Protocol, TCP (Network)|TCP]] 를 사용할 수 있지만, 기본적으로 TCP 가 가지는 오버헤드가 있기 때문에 제시된 것.

## 간략한 원리

- [[Domain Name System (DNS)|Additional]] 필드에 `OPT` 라는 가짜 (Pseudo) 레코드를 집어넣어 UDP 환경에서 4096byte 까지 보낼 수 있게 해준다고 한다.
	- "가짜" 라는 것은 실제로 저런 레코드가 [[Nameserver (DNS)|nameserver]] 에 있지는 않고, 그냥 response 패킷에만 존재한다는 뜻임
- 저 레코드에 Seq num 같은것을 넣어 패킷을 잘라서 보내고 다시 재조합할 수 있게 해주는 원리인 것 같다.