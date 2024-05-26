---
tags:
  - 용어집
  - Network
  - BGP
date: 2024-05-24
---
> [!info]- 참고한 것들
> - [[5. RPKI, BGPSEC#2. RPKI (Resource Public Key Infrastructure)|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]
> - [어떤 회사 글](https://www.noction.com/blog/rpki-overview)
> - [위키피디아](https://en.wikipedia.org/wiki/Resource_Public_Key_Infrastructure)
> - [RFC6480](https://datatracker.ietf.org/doc/html/rfc6480)
> - [RFC6482](https://datatracker.ietf.org/doc/html/rfc6482)

## 개요

- 어떤 자원 (Resource) 를 기존의 [[Public Key Infrastructure, PKI (Security)|PKI]] 를 이용해 인증하는 프레임워크인데
- 여기서 자원은 IP Prefix 나 [[Autonomous System, AS (BGP)|AS]] 의 ASN 을의미한다.
	- 왜 많고 많은 자원중에 하필이면 이것이냐 라고 물어본다면
	- 이것이 등장하게 된 계기가 [[Border Gateway Protocol, BGP (BGP)|BGP]] 에서의 문제 ([[Route Hijack Attack (BGP)|route hijack]] 과 같은) 를 해결하기 위함이기 때문이다.
	- 즉, 자꾸 어떤 이상한 놈이 자기가 갖고 있지도 않은 IP Prefix 를 가지고 있다고 떠들어대는 것을 막기 위함인 것.
- PKI 를 이용해 이것을 하는 이유는
	- 기존에 PKI 가 성공적으로 운영이 되고 있고,
	- ASN 이나 IP prefix 와 같은 internet resource 들이 계층적으로 관리된다는 것이 기존의 PKI 와 유사하기 때문에 이 resource 들도 PKI 를 이용해 관리해보자는 아이디어이다.
	- 이것이 나오기 전에는 [[Internet Routing Registry, IRR (BGP)|IRR]] 이 제시되었지만 강제성이 없어 여기에의 데이터들을 신뢰하기 힘들어 이 방법이 제시된 것.

## Issuing Resource Certificate (RC)

![[Pasted image 20240525153309.png]]

- 위에서 말한 것처럼 root CA 는 [[Regional Internet Registry, RIR (Network)|RIR]] 이 된다.
	- 기존의 PKI 에서처럼 이놈들은 그냥 묻지도 따지지도 않고 신뢰하게 되며
	- 따라서 스스로 서명한 인증서 (Self-signed certificate) 를 갖고 있다.
- 그리고 intermediate CA 는 NIR (혹은 LIR), ISP 들이 된다.
	- RIR 이 NIR (혹은 LIR) 에 인증서를 생성해 주는 것으로 시작해
	- NIR 이 LIR 에게, 혹은 LIR 이 ISP 에게 인증서를 생성해주게 된다.
- 마지막으로 ISP (혹은 경우에 따라서 End-user) 에서는 상위계층으로부터 받은 인증서를 이용해 End-entity (EE) 인증서를 생성하게 된다.
	- 따라서 얘네들은 인증서를 두개 (받은것, 받은것으로 만든것) 갖고 있게 된다.

### Resource Certificate Structure

![[Pasted image 20240525162456.png]]

- 뭐 많기는 한데 전부 PKI 관련 필드이고 resource cert 에서 중요한 것은 저 `Extension` 필드에 들어가는 값들이다.
	1. List of Resources: 인증서 주인이 가지고 있는 ASN 들과 IP addr block 들의 리스트
	2. AIA: CA cert (아마 바로 상위 계층?) 의 URI
	3. SIA: 연관된 많은 object 들 (예를 들면 바로 다음에 나올 [[#Route Origin Authorization (ROA)|ROA]]) 에 접근할 수 있는 URI

## Route Origin Authorization (ROA)

- 여기까지 오면 NIR, LIR, ISP 같은 기관들은 상위 기관으로부터 사용할 수 있는 ASN 들과 IP addr block 들, 그리고 이것들을 받았다는 인증서 (즉, resource certificate) 총 세개를 가지고 있게 될 것이다.
- AS 는 이제 AS 로 기능하기 위해 NIR/LIR/ISP 들로부터 ASN 하나와 IP prefix 들을 할당받을 것이다.
	- 여기서 주의할 점은 AS 와 NIR/LIR/ISP 를 좀 구분지어서 생각해야 된다는 것이다.
	- NIR/LIR/ISP 는 리소스를 주는놈, AS 는 그 리소스를 받아서 사용하는 놈이다.
	- 물론 LIR 과 ISP 이 흔히 AS 로 기능하긴 하지만, 이것은 스스로에게 리소스를 주는 경우라고 이해하면 된다.
- 그럼 NIR/LIR/ISP 는 AS 에게 요청받은 것 (ASN 하나, IP prefix 하나이상) 을 주며 이 할당 정보를 서명한다.
- 이때 이 "정보 + 서명" 을 ROA (Route Origin Authorization) 이라고 한다.
	- 즉, ROA 는 ==해당 AS 가 이 IP prefix 들에 포함되는 IP 들을 운영하고 있고, 이때의 ASN 과 IP prefix 들은 NIR/LIR/ISP 로부터 적법하게 할당받았다는 것에 대한 증명==인 셈

### ROA Structure

- 그림:

![[Pasted image 20240525165025.png]]

- RFC6482:

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

- 여기서 `RouteOriginAttestation` 를 서명하여 같이 첨부한 것이 ROA 가 된다.
- 보면 어려울 것은 없다.
	- `version`: ROA 의 버전을 의미한다. 무적권 0이다.
	- `asID`: ROA 는 AS 하나에 대한 문서이기 때문에 ASN 이 한개만 들어간다.
	- `addressFamily`: IP 버전 (IPv4, IPv6) 을 명시하는 부분이다. `IPv4` 일 경우에는 `0001`, `IPv6` 일 경우에는 `0002` 가 들어간다.
- 여기서 저 `maxLength` 만 좀더 보고 가자.

### Maximum Prefix Length

- *Maximum Prefix Length* 는 말 그대로 IP Prefix 의 길이이다.
- 가령, ASN-3 은 `address: 193.0.0.0/21` 와 `maxLength: 22` 를 적어서 ROA 를 받을 수 있다.
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

## Repository

- 이때 NIR/LIR/ISP 와 같은 기관들이 인증서와 ROA 등의 signed object 들을 누구나 볼 수 있게 공개하는 저장소를 *Repository* 라고 한다.
- 또한 이 signed object 들의 리스트는 *Manifest* 라고 한다.
	- 이 manifest 또한 서명된다.

## Validator, Validated ROA Payload (VRP)

![[Pasted image 20240525171029.png]]

- Repository 에 있는 ROA 를 가져와서 인증서 확인하고 하는 작업은 router 에게 부담을 주지 않기 위해 router 가 직접 하지는 않는다.
- 대신, 이 작업을 수행하는 놈을 *RPKI Validator* (혹은 *Cache*) 라고 한다.
- Validator 는 repository 에서 ROA 를 가져와가 인증서랑 비교하면서 이 ROA 가 적법한지 확인한다.
	1. ROA 에 적힌 리소스 (ASN, IP prefix) 를 할당한 기관의 resource certificate privkey 로 ROA 가 서명되었나?
	2. 그 resource certificate 은 유효한가?
	3. 그 resource certificate 의 cert chain 은 유효한가?
	4. 그 resource certificate 안에 적힌 리소스가 ROA 리소스의 superset 인가?
		- 해당 기관이 갖고 있는 리소스 중 일부를 AS 에 할당할 것이기 때문에 superset 의 관계가 된다.
		- 즉, 해당 기관이 리소스를 갖고 있냐는 cert chain 으로 검증하고 그 리소스 중 일부를 AS 에 할당한 것이 맞냐를 검증하는 것.

![[Pasted image 20240525172546.png]]

- 그리고 이 검증작업이 끝나면 서명을 빼고 (ASN 하나, Prefix 하나) 로 reformat 해서 router 에게 전달해 준다.
	- 이렇게 reformat 된 문서를 *Validated ROA Payload (VRP)* 라고 한다.

## Route Origin Validation (ROV)

- 왜 이 검증 과정을 *Route Origin Validation (ROV)* 이라는 거창한 이름으로 부르는지는 모르겠는데
- Router 는 이 VRP 를 받아 BGP announcement 를 검증하는데 사용한다.
	- *Valid*: BGP announcement 가 하나 이상의 VRP 에 의해 *Cover* 된다
		- 여기서 Cover 라는 것은 해당 ASN 에 대한 BGP announcement 메세지의 IP prefix 가 VRP 의 IP prefix 와 일치하거나 혹은 포함된다는 것을 의미한다.
	- *Invalid*: 다음과 같은 경우의 수가 있다고 한다.
		- Unauthorized AS: 신뢰할 수 없는 AS... 인데 router 는 VRP 밖에 못보니까 아마 [[#Validator, Validated ROA Payload (VRP)|Validation]] 과정에서 validate 실패한 AS 는 뭐 추가적으로 router 에게 알려주거나 하겠제
		- MaxLength violation: BGP announcement 에 명시된 IP prefix maxlength 가 VRP 의 maxlength 보다 더 큰 경우 (더 좁은 범위의 IP)
	- *NotFound*: BGP announcement 가 하나 이상의 VRP 에 의해 Cover 되지 않는 경우

## RPKI Limitations

- 아직 deployment 비율이 너무 낮다,,
- 작성시점 (2024-05-25) 기준, 50% 정도 된다 ([여기](https://rpki-monitor.antd.nist.gov/) 에서 확인할 수 있다).

![[Pasted image 20240525173726.png]]

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