---
tags:
  - 용어집
  - Network
  - DNS
date: 2024-05-26
---
> [!info]- 참고한 것들
> - [[6. DNS|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]
> - [RFC1035](https://www.rfc-editor.org/rfc/rfc1035.txt)

## Resource Record?

- 간단하게 말하면 [[Domain Name System, DNS (DNS)|DNS]] 가 일종의 Key-value DB 니까 DB entry 정도라고 생각하면 된다.

## Structure

```
                                 1  1  1  1  1  1
   0  1  2  3  4  5  6  7  8  9  0  1  2  3  4  5
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
|                                               |
/                                               /
/                      NAME                     /
|                                               |
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
|                      TYPE                     |
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
|                     CLASS                     |
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
|                      TTL                      |
|                                               |
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
|                   RDLENGTH                    |
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--|
/                     RDATA                     /
/                                               /
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
```

- `NAME`
	- KV 의 Key 에 해당 - Domain 을 뜻한다.
- `TYPE`
	- 이건 [[#Record Types]] 에서 설명해주지
- `CLASS`
	- 레코드에 대한 class 인데.. `IN` (Internet - `0x01`) 값만 사용된다.
- `TTL`
	- Time-to-live: 보통 DNS 는 [[Nameserver (DNS)|Recursive resolver]] 같은데에서 캐싱을 하기 때문에, 이 캐싱을 얼마나 할 것인가를 나타내는 값이다.
- `RDLENGTH`
	- `RDATA` 의 길이.
	- `RDATA` 가 고정된 길이를 가지지 않기 때문에, 몇 바이트를 읽어야 하는지 명시하는 필드이다.
- `RDATA`
	- 레코드의 실질적인 내용이 들어가는 곳.
	- `TYPE` 에 따라 포맷이 달라진다.

## Record Types

- 솔직히 이걸 다 설명하기는 좀 그릏고 흔히 사용되는 애들이나 좀 정리해 보자.
- RFC1035 에 있는 type 들을 전부 다 보여주면 다음과 같다:

| TYPE  | VALUE | DESCRIPTION                              |
| ----- | ----- | ---------------------------------------- |
| A     | 1     | A host address                           |
| NS    | 2     | An authoritative name server             |
| MD    | 3     | A mail destination (Obsolete - use MX)   |
| MF    | 4     | A mail forwarder (Obsolete - use MX)     |
| CNAME | 5     | The canonical name for an alias          |
| SOA   | 6     | Marks the start of a zone of authority   |
| MB    | 7     | A mailbox domain name (EXPERIMENTAL)     |
| MG    | 8     | A mail group member (EXPERIMENTAL)       |
| MR    | 9     | A mail rename domain name (EXPERIMENTAL) |
| NULL  | 10    | A null RR (EXPERIMENTAL)                 |
| WKS   | 11    | A well known service description         |
| PTR   | 12    | A domain name pointer                    |
| HINFO | 13    | Host information                         |
| MINFO | 14    | Mailbox or mail list information         |
| MX    | 15    | Mail exchange                            |
| TXT   | 16    | text strings                             |

### A, AAAA

- 어떤 domain 에 대한 IP 주소를 저장하는 레코드 타입이다.

```
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
|                    ADDRESS                    |
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
```

- `ADDRESS`: IP 주소를 저장하기 위한 32bit (8bit * 4) 필드 하나만 가진다.

### NS

- [[How DNS Works - Iterative or Recursive (DNS)|Iterative resolve]] 를 할때 상위 [[Zone (DNS)|zone]] 은 하위 zone 의 정보를 알려줘야 하기 때문에 하위 zone 의 [[Nameserver (DNS)|nameserver]] 들을 알고 있어야 한다.
- 따라서 상위 zone 은 이 `NS` 레코드 타입으로 해당 정보를 저장하고 query 가 왔을 때 응답해주게 된다.

```
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
/                   NSDNAME                     /
/                                               /
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
```

- `NSDNAME`: Nameserver 의 domain name 를 저장한다.
	- 즉, nameserver 의 IP 주소가 아닌 domain 을 저장하기에, 해당 domain 에 대한 [[#A, AAAA|A]] 레코드도 상위 zone 이 함께 갖고 있게 된다.

### CNAME

- Canonical name. Alias 라고 생각하면 된다.
- 즉, 이놈이 응답이 오면 "이놈은 이 domain 의 alias 입니다~" 라는 뜻으로 받아들이면 된다.

```
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
/                     CNAME                     /
/                                               /
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
```

- `CNAME`: 간단하게 원래의 domain 만 저장하는 필드 하나만 있다.

### PTR

- Reverse query 라고 생각하면 된다.
- 즉, IP 로 domain 을 알아내고자 할 때 사용되는, [[#A, AAAA]] 타입의 반대.

```
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
/                   PTRDNAME                    /
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
```

- `PTRDNAME`: IP 에 대한 domain 을 저장하는 필드 하나밖에 없다.