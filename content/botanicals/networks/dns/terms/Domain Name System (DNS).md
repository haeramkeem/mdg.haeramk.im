---
tags:
  - 용어집
  - Network
---
> [!info] 참고한 것
> - 컴퓨터 네트워크 특강 (권태경 교수님 '24H1, SNU CSE)
> - [Under attack? 회사 블로그](https://www.cloudflare.com/learning/dns/what-is-dns/)

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