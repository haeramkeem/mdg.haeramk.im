---
tags:
  - terms
  - network
date: 2024-05-29
---
> [!info]- 참고한 것들
> - [[12. DDos (1)|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]

## 소개

- *DoS* (*Denial of Service*): server 의 자원을 고갈시켜서 client 가 이용할 수 없게 하는 공격
	- "자원" 은 네트워크 대역폭이나 server 의 CPU, MEM 등이 될 수 있다.
- *DDoS* (*Distributed Denial of Service*): DoS 와 동일하지만, 하나의 host 가 공격하는 것이 아닌 *Botnet* 가 공격하는 것
	- *Botnet* 은 attacker 가 감염시켜 attacker 의 명령을 수행하는 (*Comand-and-Control*, *C&C*, *C2*) host 이다.

## 종류

- *Reflection attack*: Attacker 가 source IP 를 target 의 IP 로 바꿔서 제 3의 누군가에게 요청을 보내, 요청의 응답이 attacker 가 아닌 target 으로 가게 하는 방법
	- Target 입장에서는 attacker 가 아닌 "제 3의 누군가" 로 부터 공격을 받는 것처럼 보이기에 *Reflection* 라고 부르는 것.
- *Amplification attack*: 요청 사이즈에 비해 응답 사이즈가 훨씬 큰 것을 요청하는 방법.
	- 보통 위의 Reflection 과 엮어서 사용한다.
	- 즉, attacker 는 이런 amplification 될만한 것을 제 3의 누군가에게 요청하고, 사이즈가 부풀려진 응답이 target 으로 가게 되는 시나리오
	- 이러한 amplification 이 될만한 요청의 예시로 DNS query 에 `ANY` 를 넣는 것이다.
- *Carpet-bomb attack*: DDoS 에서는 하나의 server 에 대해 공격하는 것이 일반적이기에 여기에 대한 대비도 잘 되어 있는 경우가 많다.
	- 따라서 하나의 server 가 아닌 해당 server 가 속한 subnet 을 공격해 이러한 대비책을 회피하는 경우
	- 가령 40Gbps 공격을 하나의 server 에 때리면 당연히 rate 가 너무 높기 때문에 막히지만, 이것을 16384 개의 IP 가 있는 subnet 에 때리면 rate 가 2.42Mbps 가 되어 detection 이 안된다.

### 대표적인 공격들

- [[NXDomain Attack, Random-subdomain Attack (DNS)|NXDomain Attack, Random-subdomain Attack]]
- [[DNS Amplification Attack, Reflection Attack (DNS)|DNS Amplification Attack, Reflection Attack]]
- *[[Transmission Control Protocol, TCP (Network)|TCP]] SYN flooding attack*:
	- Attacker 는 target 에게 TCP SYN 를 보내고, ACK 는 보내지 않아 TCP connection 이 half-open 된 상태로 냅둔다.
	- 그리고 이짓을 앵간히 많이 하게 되면, server 는 open TCP connection 이 고갈되어 더이상의 connection 을 받지 못하는 상태가 된다.
- *Ping of Death* (*PoD*): ICMP ping 메세지의 최대 크기인 64K 로 ping 을 때리는 것
- *CharGen attack*: CharGen 은 디버깅 등의 용도로 사용되는 것으로, port 19 로 제공되는 랜덤 문자열을 생성 프로토콜이다.
	- 따라서 Reflection + Amplification attack 에 사용하기 딱 좋다.
- *SSL/TLS attack*: [[Public Key Cryptography, PKC (PKC)|PKC]] 에서는 암호화보다 복호화가 더 많은 컴퓨팅 자원을 먹기에 [[Transport Layer Security (TLS)|TLS handshake]] 는 client 보다 server 가 더 많은 자원을 사용한다.
	- 따라서 client 가 TLS handshake (version negotiation) 을 계속 반복하면 server 의 CPU 혹은 MEM 자원이 고갈되게 된다.
	- 물론 [[Transport Layer Security (TLS)#TLS 1.3, RFC8446|TLS 1.3]] 에서는 이러한 re-negotiation 이 막혀 사용하지 못하는 공격이다.
- *Bilion laughs attack*: server 의 XML 혹은 YAML 같은 parser 를 공격하는 것이다.

```XML
<!DOCTYPE TEST [
<!ELEMENT TEST ANY>
<!ENTITY LOL “LOL”>
<!ENTITY LOL1 “&LOL;&LOL;&LOL;&LOL;&LOL;&LOL;&LOL;&LOL;&LOL;&LOL;”>
<!ENTITY LOL2 “&LOL1;&LOL1;&LOL1;&LOL1;&LOL1;&LOL1;&LOL1;&LOL1;&LOL1;&LOL1;”>
<!ENTITY LOL3 “&LOL2;&LOL2;&LOL2;&LOL2;&LOL2;&LOL2;&LOL2;&LOL2;&LOL2;&LOL2;”>
<!ENTITY LOL4 “&LOL3;&LOL3;&LOL3;&LOL3;&LOL3;&LOL3;&LOL3;&LOL3;&LOL3;&LOL3;”>
<!ENTITY LOL5 “&LOL4;&LOL4;&LOL4;&LOL4;&LOL4;&LOL4;&LOL4;&LOL4;&LOL4;&LOL4;”>
<!ENTITY LOL6 “&LOL5;&LOL5;&LOL5;&LOL5;&LOL5;&LOL5;&LOL5;&LOL5;&LOL5;&LOL5;”>
<!ENTITY LOL7 “&LOL6;&LOL6;&LOL6;&LOL6;&LOL6;&LOL6;&LOL6;&LOL6;&LOL6;&LOL6;”>
<!ENTITY LOL8 “&LOL7;&LOL7;&LOL7;&LOL7;&LOL7;&LOL7;&LOL7;&LOL7;&LOL7;&LOL7;”>
<!ENTITY LOL9 “&LOL8;&LOL8;&LOL8;&LOL8;&LOL8;&LOL8;&LOL8;&LOL8;&LOL8;&LOL8;”>
]>
<TEST>&LOL9;</TEST>
```

- 위의 예시를 보면 이해가 쉬울것이다.
	- LOL 은 "LOL" 이고, LOL1 은 LOL 을 10번 반복하고, LOL2 는 LOL1 을 10 번 반복하고...
	- 따라서 LOL9 는 "LOL" 을 $10^9$ 번 반복하게 한다.
	- 이제 이것을 출력하게 되면 XML parser 가 경장히 많은 자원을 먹게 된다.

## Botnet

- 위에서 말한 것처럼, *Botnet* 은 attacker 가 감염시켜서 attacker 가 내린 명령을 수행하는 bot 들의 집합이다.
- 일반적으로 다음과 같이 구성한다고 한다.

![[Pasted image 20240529112949.png]]

- Bot-master 가 실질적으로 C&C 를 하달하는 주체이고, 이것을 C&C server 들이 bot 들에게 분배하는 계층화
- Bot 들은 자동으로 주변의 host 를 감염시키도록 propagation 을 수행하는 경우도 있다고 한다.