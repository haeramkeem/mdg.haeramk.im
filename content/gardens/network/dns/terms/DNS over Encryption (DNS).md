---
tags:
  - terms
  - network
  - dns
date: 2024-05-27
---
## 소개

- [[Domain Name System (DNS)|DNS]] 는 기본적으로 plain text 기반이고, 따라서 개인의 privacy 가 노출될 염러가 있다.
- 그냥 domain 일 뿐인데 뭔 privacy 여 시봉삭거 라고 생각할 수 있지만, domain 으로부터 추출해낼 수 있는 정보가 생각보다 많다.
	- 가령 A 씨가 사용하는 도어락은 IoT 를 활용하는 제품으로 제조사의 서버와 정보를 주고받는다고 해보자.
	- 그럼 이 도어락은 DNS query 를 주기적으로 보내게 될 것이고, attacker 는 이것을 모니터링하면 A 씨가 사용하는 도어락이 어느 회사 제품인지 알 수 있게 된다.
	- 만약 해당 회사 도어락에 어떤 버그가 있다면, attacker 는 이것을 이용해 도어락을 풀어 A 씨의 집에 침입할 수도 있다 (!!)
	- 물론 극단적이고 비현실적인 예시지만, 어쨋든 이런 비슷한 아이디어로 privacy 를 노출시키는 것은 충분히 가능하다 이거야
- 그래서 DNS 를 기존의 [[Transport Layer Security (TLS)|TLS]] 와 같은 encryption protocol 위에 올리는 아이디어가 나오게 된 것.
- Encryption 에는 데이터 크기를 맞추기 위해 padding 이 들어가기도 하기에, [[EDNS0 Padding (DNS)|EDNS0 padding option]] 을 같이 사용하기도 한다.

## 종류

### DNS-over-TLS (DoT)

- [RFC7858](https://datatracker.ietf.org/doc/html/rfc7858) 로 제안된 것으로, 말 그대로 DNS 패킷을 기존의 TLS 로 encryption 해서 보내는 것이다.
- 853/[[Transmission Control Protocol, TCP (Network)|TCP]] 를 사용한다.

### DNS-over-HTTPS (DoH)

- [RFC8484](https://datatracker.ietf.org/doc/html/rfc8484) 로 제안된 것으로, DNS 패킷을 [[HTTP with TLS, HTTPS (Network)|HTTPS]] 로 감싸는 방법이다.
- 기존 HTTPS 와 동일한 443/[[Transmission Control Protocol, TCP (Network)|TCP]] 를 사용한다.
- DoT 보다 더 많은 이목을 받아, 꽤 많이 배포되어 있고 생각보다 DoT 에 비해 느리지도 않다고 한다 ([이 연구](https://dl.acm.org/doi/10.1145/3355369.3355575) 에 따르면, DoH 가 DoT 보다 느릴 것 같지만, 실제로는 거의 비슷한 성능을 낸다고 한다.)

### DNS-over-QUIC (DoQ)

- [RFC9250](https://datatracker.ietf.org/doc/rfc9250/) 로 제안된 것으로, TLS 보다 [[QUIC (Network)|QUIC]] 이 더 가볍다는 점을 이용한 방법이다.