---
tags:
  - terms
  - network
  - tls
date: 2024-05-29
---
> [!info]- 참고한 것들
> - [[11. TLS|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]

## Downgrade Attack in TLS

- 새로운 버전이 나왔다는 것은 당연히 이전 버전에 뭔가 보안 취약점이 있다는 것을 의미한다.
- 그런데 [[Transport Layer Security (TLS)|TLS]] 와 같이 version negotiation 이 있는 프로토콜의 경우에는 MITM 이 악의적으로 프로토콜 버전을 낮춰 알려진 취약점을 활용할 수 있다.
	- *Version Rollback Attack* 이라고도 한다.
- 따라서 이전의 SSL 와 같은 경우에는 이렇게 해결했다고 한다:

![[Pasted image 20240529024043.png]]

- Client 가 `ClientKeyExchange` 를 할 때 `ClientHello` 로 보낸 version 까지 같이 공개키로 암호화해 보내 중간에 임의로 버전이 바뀌었는지 체크한다고 한다.
- 아니면 [[Transport Layer Security (TLS)|Finished 과정]] 을 활용하여 검사할 수도 있다.
- 다만, 위와 같은 것들도 결국에는 "나름 최신의 버전" 에 포함되는 기능이므로, 저런 것이 아예 없는 버전으로 내려버릴 수도 있다.
	- 그래서 이러한 공격 수법은 막기 쉽지 않다고 한다.