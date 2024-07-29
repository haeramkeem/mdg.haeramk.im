---
tags:
  - 용어집
  - Network
  - DNS
date: 2024-05-27
---
> [!info]- 참고한 것들
> - [Survey on DNS-Specific Security Issues and Solution Approaches](https://www.researchgate.net/publication/343373756_Survey_on_DNS-Specific_Security_Issues_and_Solution_Approaches)

## 뭔가

- [[Domain Name System (DNS)|DNS]] 캐시 (Cache) 에 독을 푸는 것 (Poisoning)
- [[Resolver (DNS)|DNS Resolver]] 는 매 query 마다 [[Nameserver (DNS)|Authoritative Nameserver]] 에 물어보는 것 보다는 한번 물어보고 그 결과를 캐싱해 놓아 다음 요청에서는 물어보지 않는 방법을 사용하는데
- 이때 이 캐시에 잘못된 정보가 들어가도록 하여 resolver 가 잘못된 응답을 하게 하는 것이다.
	- 캐시에 domain 에 대한 올바른 authoritative nameserver 의 IP 가 아닌 attacker 의 nameserver IP 를 저장하도록 하여
	- 해당 nameserver 로 query 가 왔을 때, attacker 가 만든 가짜 웹사이트 IP 를 응답해 해당 웹사이트로 접속하도록 유도하거나
	- 아니면 attacker 의 nameserver IP 말고 웹사이트 IP 를 찔러 넣어 원래의 웹사이트가 아닌 attacker 의 웹사이트로 바로 오도록 유도한다.

![[Pasted image 20240527015316.png]]
> 출처: [Increased DNS Forgery Resistance Through 0x20-Bit Encoding (CCS'08)](https://astrolavos.gatech.edu/articles/increased_dns_resistance.pdf)

- 공격 방법은
	- Resolver 가 auth nameserver 에게 query 를 보내고 응답이 오기 전에 attacker 가 잘못된 응답을 resolver 에 찔러 넣는 것이다.
	- 즉, 위 그림의 붉은색 빗금친 부분이 attack 이 가능한 구간인 것.
- 이를 해결하기 위해 [[Resource Record, RR (DNS)|DNS record]] 의 정품판독을 하게 하는 [[DNS Security Extension, DNSSEC (DNS)|DNSSEC]] 이나 [[Domain Name System (DNS)|DNS ID]] 를 비교하는 방법, 또는 대소문자를 변조해 attacker 가 domain 을 맞추기 어렵게 하는 [[논문 - Increased DNS forgery resistance through 0x20-bit encoding - security via leet queries|0x20 인코딩]] 등의 방법을 사용한다.