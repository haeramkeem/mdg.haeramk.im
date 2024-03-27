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

> [!info] DNS 가 분산되어 구현되듯이, DNS 의 개념 설명도 Distributed 시켜놓고자 한다.
> - 뭐 DNS 관련해서는 개념들이나 설명할 것이 한도 끝도 없기 때문.
> - ...그래서 이 문서에는 따로 파일을 파기도 뭐하고 그렇다고 설명 안하기도 뭐한 애매한 것들을 적어놓는 곳이 될것이야.
> - DNS 관련 다른 작물들을 보고자 한다면, [[(Botanical Garden) Network, Protocol|상위 문서]] 로 가시면 되니다.