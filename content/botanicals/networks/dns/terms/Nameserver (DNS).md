---
tags:
  - 용어집
  - Network
  - DNS
date: 2024-03-24
---
> [!info] 참고한 것
> - 컴퓨터 네트워크 특강 (권태경 교수님 '24H1, SNU CSE)
> - [불타는 구름](https://www.cloudflare.com/learning/dns/dns-server-types/)

## 이게 뭐임

- [[Domain Name System, DNS (DNS)|DNS]] name 와 관련된 작업을 수행하는 server 이다.
	- 조금 더 구체적으로는, 어떤 [[Zone (DNS)|Zone]] 의 domain 에 대한 record 들을 저장하고, 이것에 대한 query 가 들어왔을 때 응답하는 등의 작업을 하는 server 를 말한다.
- [이 사이트](https://www.dynu.com/en-US/NetworkTools/Delegation) 에 가서 도메인을 입력하면 해당 도메인에 대한 zone 들과 해당 zone 의 nameserver 를 한눈에 볼 수 있다.
	- [MDG](https://mdg.haeramk.im) 의 경우에는 다음과 같다...

![[Pasted image 20240403160530.png]]



## 종류

- DNS nameserver 는 크게 다음의 네 가지로 구분될 수 있다고 한다:

### Recursive Resolver

- Frontend nameserver 라고 생각하면 된다.
- 여러 host 들로 부터 DNS query 를 가장 먼저 받아들여서,
- 자기 자신에는 많은 정보를 저장하지 않고, 다른 DNS nameserver 들로 query 를 forward 해 IP 를 받아와 host 들에게 응답하고 (이 부분은 [[Resolver (DNS)|이 문서]] 에서 좀 더 자세히 알아보자)
- 해당 IP 를 caching 하여 다음번의 query 에 빠르게 응답하는 역할의 server 이다.
- Google 의 8.8.8.8(8.8.4.4) 나 Cloudflare 의 1.1.1.1(1.0.0.1) 같은 애들이다.

### Root Nameserver

- Root zone 을 담당하는 server 를 *Root Nameserver* 라고 한다.
- `dig` 명령어에 아무 인자 없이 입력하면 이 root nameserver 들을 볼 수 있다.
	- 만일 안나온다면 `dig . NS` 를 입력하면 된다.

![[Pasted image 20240327222305.png]]

- 위의 사진에서 확인할 수 있듯이, 전 세계적으로 `[a-m].root-servers.net` 총 13개의 nameserver 들이 운영되고 있다.

### TLD Nameserver

- [[Top Level Domain, TLD (DNS)|TLD]] 각각의 zone 에 대한 server 를 `TLD Nameserver` 라고 한다.
- 대표적인 TLD 인 `.com` 에 대한 nameserver 들을 확인해 보자.

```bash
dig com NS
```

![[Pasted image 20240327222158.png]]

- 전 세계적으로 `[a-m].gtld-server.net` 13개의 nameserver 가 운영되는 것을 볼 수 있다.

### Authoritative Nameserver

- 어떤 Zone 을 담당하고 있는 server 를 *Authoritative Nameserver* 라고 한다.

## Anycast in Nameserver

- 일단 *Anycast* 는 여러 서버가 같은 (ASN, IP Prefix) 를 갖고록 해서 클라이언트가 질의를 해서 BGP 를 탔을 때 이러한 서버 중에서 가장 가까운 놈이 응답을 하는 방식을 말한다.
	- CDN 생각하면 이해가 빠르다
- [[#Root Nameserver]] 를 포함한 nameserver 들이 이런식으로 운영되고 있다.
	- Root Nameserver 의 경우에는, [root-servers.org](http://root-servers.org) 에 가면 어디에서 이런 server 가 운용되는지 확인할 수 있다.