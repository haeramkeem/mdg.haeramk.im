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

## Packet structure

- EDNS0 Padding option 은 `OPT` 타입의 resource record 로 DNS packet 의 [[Domain Name System, DNS (DNS)#DNS message format|Additional 필드]] 에 들어간다.
- 이놈의 `OPT` RR 은 다음과 같이 생겼다.

```
0                       8                      16
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
|                  OPTION-CODE                  |
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
|                 OPTION-LENGTH                 |
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
|        (PADDING) ...        (PADDING) ...     /
+-  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
```

- 필드 설명
	- `OPTION-CODE` 는 `OPT` RR 내에서의 타입을 명시하는 곳이다. EDNS0 Padding 의 경우에는 12 (`0x000C`) 이다.
	- `OPTION-LENGTH` 는 뒤의 `PADDING` 필드의 길이이다.
	- `PADDING` 필드는 `0x00` 으로 채워진 패딩이다.
- 예시로, `www.google.com` 을 물어보는 패킷을 총 사이즈 512byte 가 되게 하기 위해 이 패딩을 붙인다고 하면
	- [[Domain Name System, DNS (DNS)#Header|Header]]: 16byte
		- 여기에는 [[Domain Name System, DNS (DNS)#Header|QDCOUNT]] 값이 (query 1개이므로) 1로 설정되고,
		- [[Domain Name System, DNS (DNS)#Header|ARCOUNT]] 값이 (padding 한개이므로) 1로 설정될 것이다.
	- [[Domain Name System, DNS (DNS)#Question|Question]]: 20byte
		- [[Domain Name System, DNS (DNS)#Question|QNAME]]: `3www6google3com0` -> 16byte
		- [[Domain Name System, DNS (DNS)#Question|QTYPE]]: A (`0x0001`) -> 2byte
		- [[Domain Name System, DNS (DNS)#Question|QCLASS]]: Internet (`0x0001`) -> 2byte
	- [[Domain Name System, DNS (DNS)#DNS message format|Additional]]: 476byte
		- `OPTION-CODE`: Padding (`0x000C`) -> 2byte
		- `OPTION-LENGTH`: 패딩길이 (`0x01D8`) -> 2byte
		- `PADDING`: 472byte 길이의 패딩이 들어감