---
tags:
  - terms
  - network
  - dns
date: 2024-05-27
aliases:
  - NXDomain Attack
  - Random-subdomain Attack
---
> [!info]- 참고한 것들
> - [[6. DNS#DNS|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]

## 소개

![[Pasted image 20240527020724.png]]

- [[Domain Name System (DNS)|DNS]] 를 이용한 [[Denial of Service, DoS (Network)|DoS]] 공격의 일종이다.
- NXDomain 은 non-existent domain, 즉 존재하지 않는 도메인이라는 뜻이다.
- 해커가 존재하지 않는 도메인에 대한 쿼리를 잔뜩 날리게 되면 그것은 [[Resolver (DNS)|local DNS resolver]] 를 타고 [[Nameserver (DNS)|authoritative DNS nameserver]] 로 갈텐데 없는 도메인이기 때문에 cache 되지 않고 항상 nameserver 로 가게 된다
- 이런식으로 nameserver 를 공격해 해당 nameserver 가 관리하는 domain 들을 전부 먹통으로 만드는 공격 방법이다.
- 이를 막기 위해서
	- Negative cache 를 가져서 질의를 카운트 하고, 너무 많은 질의의 경우에는 차단하거나
	- [[Bloom Filter (Data Structure)|Bloom filter]] 로 NXDomain 이 nameserver 로 가지 못하게 하는 방법을 사용할 수 있다고 한다.