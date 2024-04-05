---
tags:
  - 용어집
  - Security
---
> [!info]- 참고한 것
> - [어떤 회사 글](https://www.noction.com/blog/rpki-overview)
> - [위키피디아](https://en.wikipedia.org/wiki/Resource_Public_Key_Infrastructure)
> - [RFC6480](https://datatracker.ietf.org/doc/html/rfc6480)

> [!fail]- 본 글은 #draft 상태입니다.
> - [ ] 내용 정리

## 뭘까

- 어떤 자원 (Resource) 를 기존의 [[Public Key Infrastructure, PKI (Security)|PKI]] 를 이용해 인증하는 프레임워크인데
- 여기서 자원은 IP Prefix 와 그것을 소유하고 있는 [[Autonomous System, AS (Network)|AS]] 의 ASN 의 매핑을 의미한다.
	- 왜 많고 많은 자원중에 하필이면 이것이냐 라고 물어본다면
	- 이것이 등장하게 된 계기가 [[Border Gateway Protocol, BGP (Network)|BGP]] 에서의 보안 취약점을 해결하기 위해 등장한 것이기 때문이다.
	- 즉, 자꾸 어떤 이상한 놈이 자기가 갖고 있지도 않은 IP Prefix 를 가지고 있다고 떠들어대는 것을 막기 위함인 것.
- 이놈은 다른 인터넷 관련 자원인 public IP 나 ASN 처럼 [[Regional Internet Registry, RIR (Network)|RIR]] 이 발급, 관리한다.
	- RIR 은 요청이 들어오면 (아마 나름의 검증 절차를 거친 뒤에) 이 인증서를 발급해 준다.
	- 이 인증서는 1년마다 갱신하는 것이 원칙이고
	- RIR 은 root CA 로서 self-signed certificate 으로 이 인증서를 발급해 준다.

## Route Origination Authorization (ROA)

- 이때 저 IP Prefix 와 ASN 를 적고 이것을 서명한 문서를 *Route Origination Authorization (ROA)* 라고 한다.
- 아래와 같은 방식으로 구성된다고 한댜:

```
RouteOriginAttestation ::= SEQUENCE {
    version [0] INTEGER DEFAULT 0,
    asID  ASID,
    ipAddrBlocks SEQUENCE (SIZE(1..MAX)) OF ROAIPAddressFamily
}

ASID ::= INTEGER

ROAIPAddressFamily ::= SEQUENCE {
    addressFamily OCTET STRING (SIZE (2..3)),
    addresses SEQUENCE (SIZE (1..MAX)) OF ROAIPAddress
}

ROAIPAddress ::= SEQUENCE {
    address IPAddress,
    maxLength INTEGER OPTIONAL
}

IPAddress ::= BIT STRING
```

- 여기서 `RouteOriginAttestation` 을 서명한 것이 ROA 가 된다 (아마?)
- 우선 여기서 그다지 중요하지 않은 내용부터 정리해 보자.
	- `version`: ROA 의 버전을 의미한다. 조건 0이다.
	- `addressFamily`: IP 버전 (IPv4, IPv6) 을 명시하는 부분이다. `IPv4` 일 경우에는 `0001`, `IPv6` 일 경우에는 `0002` 가 들어간다.

### IP Prefix, ASN

- RPKI 의 핵심이 IP Prefix 와 ASN 를 인증하는 것이기 때문에 당연히 들어가야 되는 항목이 맞는데
- 눈여겨볼 점은 IP Prefix (`addresses`) 는 여러개를 지정할 수 있고 ASN (`adID`) 은 하나만 지정이 가능하다는 것이다.
- 즉, 한 AS 는 여러 IP Prefix 를 advertise 할 수 있고 그것에 대한 ROA 인증서를 생성할 수 있다.
- 하지만 어떤 기관은 여러개의 AS 를 소유할 수 있는데, 이것에 대해서는 하나의 ROA 로 안된다는 얘기이다.
	- 각각의 AS 에 대해 ROA 를 발급받아야 하는 것.

### Maximum Prefix Length

- *Maximum Prefix Length* 는 말 그대로 IP Prefix 의 길이이다.
- 가령, ASN-3 은 `address: 193.0.0.0/21` 와 `maxLength: 22` 를 적어서 ROA 를 생성할 수 있다.
	- 이렇게 하면 ASN-3 은 193.0.0.0/21 과 193.0.0.0/22, 193.0.4.0/22 등의 IP Prefix 들은 advertise 할 수 있지만,
	- 193.0.2.0/23 이나 193.0.7.0/24 등의 IP Prefix 는 advertise 할 수 없다.
		- 193.0.0.0/21 에 다 포함되지 않나? 라고 생각할 수 있는데
		- BGP 작동 원리를 떠올려 보면 이것은 분명히 다르다는 것을 알 수 있다.
		- BGP 는 라우팅을 할 때 longest-matching 을 사용하기 때문에, 다른 AS 에서 193.0.7.0/24 를 advertise 하지 않는다면 해당 패킷들은 ASN-3 으로 가게 되겠지만
		- 만일 다른 AS 가 193.0.7.0/24 를 advertise 하면 그쪽으로 가게 되는 것.
- 기본값은 IP Prefix 에 적힌 Length 이다.
	- 즉, 위의 예시에서 `maxlen: 22` 가 없다면, ASN-3 은 193.0.0.0/22 를 advertise 하지 못한다.
- 그리고 위의 ROA 구조를 보면 알 수 있듯이, 이 값은 IP Prefix 마다 설정할 수 있다.
	- IP Prefix 를 여러개 명시할 경우, 각각에 대한 `maxLength` 를 설정할 수 있다.

## State

- 이 ROA 를 검증했을 때에는 세가지의 결과가 나올 수 있다.
	- `valid`: ROA 에 있는 IP Prefix 와 ASN 이 advertise message 에 있는 것과 동일함
	- `invalid`: ROA 에 있는 IP Prefix 와 ASN 이 advertise message 에 있는 것과 동일하지 않음
	- `not-found`: Advertise message 에 ROA 가 없음

## Configuration Example (Cisco)

```
!  
router bgp 65000  
address-family ipv4 unicast  
neighbor 10.0.102.1 route-map rtmap-PEX1-3 in  
bgp bestpath prefix-validate allow-invalid  
!  
route-map rtmap-PEX1-3 permit 10  
match rpki invalid  
set local-preference 50  
!  
route-map rtmap-PEX1-3 permit 20  
match rpki not-found  
set local-preference 100  
!  
route-map rtmap-PEX1-3 permit 30  
match rpki valid  
set local-preference 200  
!  
route-map rtmap-PEX1-3 permit 40  
!
```

- 위에는 Cisco router 의 설정 예시인데
- `rtmap-PEX1-3` 을 보면
	- `invalid` 일 때는 local preference 를 50
	- `not-found` 일 때는 100
	- `valid` 일 때는 200 으로 설정한 것을 볼 수 있다.
- 즉, RPKI 의 상태에 따라 신뢰할 수 있는 정도를 반영해 local preference 를 다르게 준 셈.