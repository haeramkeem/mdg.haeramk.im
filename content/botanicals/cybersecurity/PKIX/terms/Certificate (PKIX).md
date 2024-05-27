---
tags:
  - 용어집
  - Security
  - PKIX
date: 2024-05-27
---
> [!info]- 참고한 것
> - [[7. PKC|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]

## 인증서?

- Client 입장에서는 server 의 [[Public Key Cryptography, PKC (PKC)|pubkey]] 를 가지고 [[Transport Layer Security, TLS (Network)|TLS]] 를 하던 해야 되는데
- 근데 pubkey 라는것이 원래가 막 공개되는 놈이기 때문에 client 입장에서는 어떤 pubkey 가 내가 원하는 server 의 pubkey 인지 알 수가 없다.
- 그래서 *Trusted Third Party* (*TTP*) 가 server 에 대한 정보들과 pubkey 까지 묶어서 서명을해 client 입장에서 이 pubkey 가 내가 원하는 server 의 것이 맞구나 를 알게 하는 방법을 사용하게 된다.
- 여기서 이 `pubkey + server 정보 + sign` 을 합쳐서 인증서 (*Certificate*) 라고 부르고
	- 이 "server 정보" 에는 간단하게
		- 누가 발급해줬는지
		- 주인 (server) 는 누구인지
		- 유통기간은 언제까지인지
		- 이 pubkey 가 어떤 용도로 사용될 수 있는지
	- 정도가 들어간다.
- 이 TTP 는 *[[Certificate Authority, CA (PKIX)|Certificate Authority]]* 라고 부르게 된다.