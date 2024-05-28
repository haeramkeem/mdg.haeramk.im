---
tags:
  - 용어집
  - Network
  - DNS
date: 2024-05-27
---
> [!info]- 참고한 것들
> - [[8. DNSSEC|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]
> - [구름과자](https://www.cloudflare.com/dns/dnssec/how-dnssec-works/)
> - [RFC4034](https://datatracker.ietf.org/doc/html/rfc4034)
> - [RFC4035](https://datatracker.ietf.org/doc/html/rfc4035)

## 소개

- [[Domain Name System, DNS (DNS)|DNS]] 에서 [[Resolver (DNS)|resolver]] 의 작동 과정을 보면 authentication 에 대한 고려가 전혀 없다는 것을 알 수 있다.
	- 즉, resolver 입장에서는 응답받은 [[Resource Record, RR (DNS)|record]] 의 진품여부를 확인할 수가 없는 것.
	- 따라서 이러한 점을 노려 공격하는 것이 [[Cache Poisoning, Spoofing (DNS)|DNS cache poisoning]] 인 것이다.
- 그래서 record 의 진품여부를 [[Public Key Infrastructure X509, PKIX (PKIX)|PKI]] 로 제공하고자 하는 것이 *DNS Security Extension* (*DNSSEC*) 이다.
    - *Integrity*: [[Nameserver (DNS)|nameserver]] 가 보낸 record 가 중간에 변경되지 않음
    - *Authentication*: nameserver 에 대한 신원 인증

## 서명 생성 절차

- 어떤 nameserver 가 다음과 같은 record 들을 가지고 있었다고 해보자.

```
A{example.com, 1.2.3.4}
A{example.com, 5.6.7.8}
```

- 일단 nameserver 는 비대칭키 쌍을 하나 생성하고, 그 중 공개키를 `DNSKEY` 라는 record type 으로 record 에 추가한다.
	- 이 비대칭키는 record 들을 서명하고 검증하는데 사용할 것이므로 *Zone Signing Key* (*ZSK*) 라고 부른다.

```
A{example.com, 1.2.3.4}
A{example.com, 5.6.7.8}
DNSKEY{zsk_pubkey}
```

- 그리고 nameserver 이 비대칭키 쌍 중 개인키로 자신이 가지고 있는 모든 record 들을 서명하여 `RRSIG` 라는 record type 으로 record 에 추가한다.
	- 다만 이 개인키로는 `DNSKEY` record 는 서명하지 않는다.
	- 같은 domain 과 record type 을 가지는 record 는 여러개일 수 있는데, 이들을 *RRSet* (*Resource Record Set*) 라고 부른다.
		- 가령 `example.com` 에 대해서 여러 IP 를 `A` record 들로 가지는 등
	- 그리고 이 RRSet 당 하나의 `RRSIG` record 를 생성하게 된다.
		- 구체적으로는 metadata (`RRSIG` 의 RDATA 에서 signature 만 뺀 부분) 와 RRSet 의 모든 RR 들을 합친다음 서명하는 식으로 생성한다.

```
zsk_sign := sign(
  zsk_priv, 
  {RRSIG_RDATA, A{example.com, 1.2.3.4}, A{example.com, 5.6.7.8}}
)
```

```
A{example.com, 1.2.3.4}
A{example.com, 5.6.7.8}
DNSKEY{zsk_pubkey}
RRSIG{zsk_sign}
```

- `DNSKEY` record 에 대해서는, 비대칭키를 하나 더 생성하여 서명해 `RRSIG` record 를 생성한다 [^rrsig-payload].
	- 이 비대칭키는 위에서 생성한 키를 서명하는 데에 사용되었으므로, *Key Signing Key* (*KSK*) 라고 부른다.
	- 이 비대칭키에 대한 공개키도 `DNSKEY` record 로 추가한다.

```
A{example.com, 1.2.3.4}
A{example.com, 5.6.7.8}
DNSKEY{zsk_pubkey}
RRSIG{zsk_sign}
DNSKEY{ksk_pubkey}
RRSIG{ksk_sign}
```

- 그리고 마지막으로, KSK `DNSKEY` record 를 hash 해 해당 nameserver 의 상위 zone 으로 보내고, 상위 zone 에서는 이것을 받아 `DS` (Delegation Signer) record type 으로 저장한다.
	- 이렇게 ZSK 와 KSK 두개를 사용하는 이유는 record sign 에 사용되는 key 를 상위 zone 과 분리하기 위함이다.
	- 만일 ZSK 를 `DS` record 로 만들어 상위 zone 으로 올려보낸다면, 이 key 를 rotation 하면 상위 zone 의 `DS` record 도 변경해야 하고, 이 `DS` record 에 대한 `RRSIG` 도 변경해야 하기 때문에 관리의 복잡성이 늘어난다.
	- 하지만 상위 zone 과 분리하면 이 key 를 자주 rotation 할 수 있기 때문에, 보안 수준이 더욱 높아지게 되는 것.

```
parent:
DS{ksk_hash}

child:
A{example.com, 1.2.3.4}
A{example.com, 5.6.7.8}
DNSKEY{zsk_pubkey}
RRSIG{zsk_sign}
DNSKEY{ksk_pubkey}
RRSIG{ksk_sign}
```

- 이와 같은 과정이 상위 zone 에서도 연쇄적으로 일어나, 결과적으로 다음과 같은 형상을 띄게 된다.

![[Pasted image 20240527131001.png]]
> 출처: 서울대 컴공 권태경교수님 수업 자료

### 정리

- 요약하면, DNSSEC 에서는 다음과 같은 record type 이 추가된다.

| TYPE NAME | FULL NAME                 | DESCRIPTION                               |
| --------- | ------------------------- | ----------------------------------------- |
| `DS`      | Delegation Signer         | 상위 zone 이 가지고 있는 하위 zone 의 KSK 공개키 hash 값 |
| `DNSKEY`  | DNS Key                   | ZSK 혹은 KSK 의 공개키                          |
| `RRSIG`   | Resource Record Signature | Record 에 대한 서명                            |

- 그리고 DNSSEC 에서는 다음의 두 종류의 Key 가 사용된다.
	- 이 두 키는 `DNSKEY` record 의 7번째 bit 에 따라 구분된다.
	- 이 bit 가 1이면, ZSK 가 저장되어 있다는 의미이고, 이 key 를 이용해 `RRSIG` record 를 verify 할 수 있다는 것을 의미한다.
	- 반면에 0이면, ZSK 가 아닌 key 가 저장되어 있다는 것이고, 이 key 를 이용해 `RRSIG` record 를 verify 하는 것이 금지된다.

| NAME | FULL NAME        | DESCRIPTION                 |
| ---- | ---------------- | --------------------------- |
| ZSK  | Zone Signing Key | Zone 의 RR 들을 서명하기 위한 비대칭키 쌍 |
| KSK  | Key Signing Key  | ZSK 를 서명하기 위한 비대칭키 쌍        |

## Record validation

- Resolver 에서 record 를 validation 하는 것은 다음처럼 수행할 수 있다.
- 일단 record $R$ 이 있다고 해보자.
- 그럼 $R$ 에 대한 검증은 $R$ 에 대한 `RRSIG` record $RS$ 와 ZSK `DNSKEY` record $ZD$ 로 수행할 수 있다.

$$
signVerify(R, RS, ZD)
$$

- 그리고 $ZD$ 에 대한 검증은 $ZD$ 에 대한 `RRSIG` record $ZS$ 와 KSK `DNSKEY` record KD 로 수행할 수 있다.

$$
signVerify(ZD, ZS, KD)
$$

- 마지막으로 KD 에 대한 검증은 상위 zone 의 `DS` record $KH$ 로 수행할 수 있다.

$$
compare(KH, hash(KD))
$$

- `DS` record 또한 `RRSIG` record 가 있으므로 (물론 상위 zone 이 DNSSEC 을 지원한다는 전제 하에), 위의 과정을 반복하여 임의의 record $R$ 에 대한 검증을 할 수 있다.

## Key management

- ZSK 의 경우에는 다른 zone 에 영향을 미치지 않기 때문에 짧은 주기로 key 를 rotation 하여 보안수준을 올리고, KSK 는 상대적으로 더 긴 주기로 rotation 을 수행한다.
- 각 Key 들이 영향을 미치는 record 들을 그림으로 표현하면 다음과 같다.

![[Pasted image 20240527135125.png]]
> 출처: 내가 해냄

### ZSK rotation

- ZSK 와 연관되어 있는 record 들은 (1) ZSK `DNSKEY` record, (2) ZSK `DNSKEY` record 에 대한 `RRSIG` record, (3) ZSK 로 서명한 `RRSIG` record 이다.
- 따라서 요래 해주면 될 것이다.
	1. ZSK `DNSKEY` record 변경
	2. 변경된 ZSK `DNSKEY` record 를 KSK 로 서명해 ZSK `DNSKEY` record 에 대한 `RRSIG` record 재생성
	3. 변경된 ZSK 로 RRSet 을 서명해 `RRSIG` record 재생성

### KSK rotation

- KSK 와 연관되어 있는 record 들은 (1) KSK `DNSKEY` record, (2) `DS` record, (3) KSK 로 서명한 ZSK `DNSKEY` record 에 대한 `RRSIG` record 이다.
- 따라서, 이렇게 하면 된다
	1. KSK `DNSKEY` record 변경
	2. 변경된 KSK 를 hash 해 `DS` record 재생성
	3. 변경된 KSK 로 ZSK `DNSKEY` record 를 서명해 ZSK `DNSKEY` record 에 대한 `RRSIG` record 재생성

## Packet structure modifications

### Header

- DNSSEC 에서는 기존의 [[Domain Name System, DNS (DNS)|DNS header]] 에 다음과 같은 Flag 가 추가된다.

| FLAG | NAME              | DESCRIPTION      |
| ---- | ----------------- | ---------------- |
| `AD` | Authentic Data    | DNSSEC 으로 검증된 응답 |
| `CD` | Checking Disabled | DNSSEC 확인 비활성화   |

### OPT RR

- [[Extention Mechanisms for DNS, EDNS0 (DNS)|EDNS]] 에서의 `OPT` record 에도 다음의 Flag 가 추가된다.

| FLAG | NAME      | DESCRIPTION                     |
| ---- | --------- | ------------------------------- |
| `DO` | DNSSEC OK | Resolver 가 DNSSEC 을 지원한다는 것을 의미 |

## Limitations

1. 당연히 signature verify 에 소모되는 overhead
2. DNSSEC 은 data 의 위조방지 (integrity) 및 nameserver 신원확인 (authenticity) 를 위한 것이다. 암호화와는 다르다.
	- Resolver 와 nameserver 사이에서는 (어차피 누가 resolver 에게 query 를 했는지 알 수 없기 때문에) 암호화가 필요 없을 수 있지만,
	- Host 와 resolver 사이에서는 암호화가 필요하다.
	- 암호화를 하여 타인이 내용을 보지 못하게 하는 것은 [[DNS over Encryption (DNS)|DNS-over-뭐시기]] 에서 다룬다.
3. [[Zone Delegation (DNS)|Zone delegation]] 에의 `NS`, `A` record `RRSIG` 생성 문제
	- Zone delegation 을 할 때에는 Nameserver 의 domain 인 `NS` record 와 해당 domain 의 IP 인 `A` record 를 상위 zone 에 유지한다.
	- 하지만 이놈들은 하위 zone 에게 소유권이 있기 때문에 상위 zone 에서는 얘네들에 대해서는 `RRSIG` record 를 생성하지 못한다.
	- 즉, 이놈들에 대해서는 DNSSEC 을 사용하지 못한다는 것이고, 이러한 점이 공격에 사용될 수 있다
		- 뭐 가령 attacker 가 잘못된 `NS`/`A` record 를 resolver 에게 찔러넣는다든지
	- [관련 칼럼](https://blog.apnic.net/2024/02/08/dns-and-the-proposed-deleg-record/)

---
[^rrsig-payload]: [Cloudflare](https://www.cloudflare.com/dns/dnssec/how-dnssec-works/) 에서는 DNSKEY RR 자체가 아니라 그 안의 pubkey 만 서명한다고 되어 있는데, 뭐가 맞는지 모르겠음