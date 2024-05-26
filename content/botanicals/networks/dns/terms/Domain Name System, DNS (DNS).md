---
tags:
  - 용어집
  - Network
  - DNS
date: 2024-03-25
---
> [!info]- 참고한 것
> - [[6. DNS#DNS|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]
> - [Under attack? 회사 블로그](https://www.cloudflare.com/learning/dns/what-is-dns/)
> - [RFC1035](https://www.rfc-editor.org/rfc/rfc1035.txt)

## DNS: Key(Domain)-Value(IP) Store

- DNS 의 목표는 아주 간단하다: 문자열 형태의 domain 을 IP 로 변환하는 것.
- 따라서 DNS 은 마치 하나의 거대한 Key-value store 라고 생각할 수 있다.
- 이것을 구현하는 방법은 중앙집권화 (Centralized) 하는 방법과, 분산 (Distributed) 하는 방법이 있을 텐데, 실제로는 분산되어 구현되게 된다.
	- 중앙집권화 되어 있을 경우에는 다음과 같은 문제점이 있다:
		1. 단일 실패점
		2. 중앙 서버로 다수의 트래픽이 몰림
		3. 어떤 client 에게는 가깝고 누구에게는 멀고
		4. 확장성 문제

## Domain-IP 관계

- 1:1 관계가 일반적이지만
- 도메인 여러개가 하나의 IP 를 받을 수도 있고
- 도메인 한개가 여러 IP 를 받을 수도 있다고 한다.

## DNS message format

- 전체적으로 보면 이렇게 생깃다:

```
+---------------------+
|        Header       |
+---------------------+
|       Question      | the question for the name server
+---------------------+
|        Answer       | RRs answering the question
+---------------------+
|      Authority      | RRs pointing toward an authority
+---------------------+
|      Additional     | RRs holding additional information
+---------------------+
```

- `Header`: Metadata. [[#Header]] 에서 설명해준다.
- `Question`: Query 내용이 담기는 곳. [[#Question]] 에서 설명해 준다.
- `Answer`: Query 에 대한 answer 가 담기는 곳.
- `Authority`: Query domain 을 담당하는 [[Nameserver (DNS)|nameserver]] 가 누구인지 같이 알려주는 항목이다.
	- 응답의 [[Resource Record, RR (DNS)|NS record]] 가 담기는 부분이라고 생각해도 될듯
- `Additional`: `Authority` 에 담긴 nameserver 들의 IP 정보들이 담기는 곳이다.
	- `Authority` 에 담긴 NS record 들에 대한 A/AAAA record 가 담기는 부분인 셈.
- `Answer`, `Authority`, `Additional` 에는 [[Resource Record, RR (DNS)|Resource Record]] 들이 담긴다. RR의 포맷은 해당 문서에서 확인하자.

### Header

```
                                 1  1  1  1  1  1
   0  1  2  3  4  5  6  7  8  9  0  1  2  3  4  5
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
|                      ID                       |
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
|QR|   Opcode  |AA|TC|RD|RA|   Z    |   RCODE   |
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
|                    QDCOUNT                    |
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
|                    ANCOUNT                    |
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
|                    NSCOUNT                    |
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
|                    ARCOUNT                    |
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
```

- `ID`
	- 말 그대로 ID.
	- Query 와 Response 에 동일한 ID 를 사용해서 어떤 query 에 대한 response 인지 명시한다.
- Flags
	- `QR`: Query or Response.
		- Query 면 `0` 이고 response면 `1` 이다.
	- `OPCODE`: Operation code.
		- 모두 알 필요는 없고, 보통 `0` (Standard query) 이란 것만 알고 있자.
	- `AA` : Authoritative Answer.
		- Cache 된 값이 아니고 [[Nameserver (DNS)|authoritative nameserver]] 가 보내온 따끈따끈한 응답이라는 소리다.
	- `TC`: Truncation.
		- DNS 는 UDP 에서 작동하기에 512byte 를 넘으면 안되고, 응답이 이것을 넘을 것 같으면 이 flag 를 올려 TCP 로 전환하게 한다.
	- `RD`: Recursion desired.
		- Query 에 담아서 보내는 것으로, Iterative 가 아닌 recursive 로 처리하기를 바란다는 것이다 (기본적으로는 [[Resolver (DNS)|iterative]] 하게 작동한다).
	- `RA`: Recursion available.
		- Response 에 담기는 것으로, recursive 가 default 가 아니기 때문에 recursive 로도 가능하다고 알려주는 부분이다.
	- `Z`: Reserved 공간이다.
	- `RCODE`: Return code.
		- 응답 상태인데, `0` 이 정상 응답 (No error) 이고 `2` 가 서버 에러 (Server fail) 이라는 것 정도만 알고 있자.
- Count: Payload 의 각 필드에는 여러개의 내용이 들어갈 수 있기 때문에, 몇개가 들어가 있는지 알리는 부분이다.
	- `QDCOUNT`: `Quetion` 필드에 담긴 내용의 개수
	- `ANCOUNT`: `Answer` 필드에 담긴 내용의 개수
	- `NSCOUNT`: `Authority` 필드에 담긴 내용의 개수
	- `ARCOUNT`: `Additional` 필드에 담긴 내용의 개수

### Question

```
                                 1  1  1  1  1  1
   0  1  2  3  4  5  6  7  8  9  0  1  2  3  4  5
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
|                                               |
/                     QNAME                     /
/                                               /
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
|                     QTYPE                     |
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
|                     QCLASS                    |
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
```

- `QNAME`: Query 할 domain.
	- Domain 은 label 하나당 알파벳 최대 63개 (63 byte), 전체적으로는 최대 255 개로 제한되어 있다고 한다.
	- 근데 domain 은 분명히 가변적인 길이를 가질텐데, 딱히 길이를 명시하는 필드가 없는 것이 이상할 수 있다.
	- 이것은 QNAME 이 다음과 같이 처리되기에 가능한 일이다:
		- 일단 label 의 시작은 label 의 길이를 나타내는 16진수이다.
		- 그리고 해당 개수만큼의 알파벳을 읽어들이는 식으로 하나의 label 을 읽는다.
		- 그리고 label 의 알파벳 개수가 0 이라면, 종료 (root 로 간주)
		- 예를 들면, `.com` TLD 의 경우에는 `0x03(3) 0x63(c) 0x6F(o) 0x6D(m)` 로 표현되는 것.
- `QTYPE`: Query 할 record type.
	- 일반적으로는 domain 으로 ip 를 질의하기 때문에 `A`(혹은 `AAAA`) 가 들어간다.
- `QCLASS`
	- 몰라도 된다. 어차피 `IN` (Internet, `0`) 만 허용되는 필드이다.