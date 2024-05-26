---
tags:
  - 용어집
  - Network
  - DNS
---
> [!info] 참고한 것
> - [Survey on DNS-Specific Security Issues and Solution Approaches](https://www.researchgate.net/publication/343373756_Survey_on_DNS-Specific_Security_Issues_and_Solution_Approaches)

## 뭔가

- DNS 캐시 (Cache) 에 독을 푸는 것 (Poisoning)
- [[Resolver (DNS)|DNS Resolver]] 는 매 query 마다 [[Nameserver (DNS)|Authoritative Nameserver]] 에 물어보는 것 보다는 한번 물어보고 그 결과를 캐싱해 놓아 다음 요청에서는 물어보지 않는 방법을 사용하는데
- 이때 이 캐시에 잘못된 정보가 들어가도록 하여 resolver 가 잘못된 응답을 하게 하는 것이다.
	- 일반적인 공격 방법은 캐시에 domain 에 대한 올바른 authoritative nameserver 의 ip 가 아닌 attacker 의 nameserver ip 를 저장하도록 하여
	- 해당 nameserver 로 query 가 왔을 때, attacker 가 만든 가짜 웹사이트 ip 를 응답해 해당 웹사이트로 접속하도록 유도하는 방법을 많이 사용한다.
- 이것을 해결하기 위한 방법중 하나로 [[DNS Security Extension, DNSSEC (DNS)|DNSSEC]] 이 있다.