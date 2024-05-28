---
tags:
  - 용어집
  - Network
  - TLS
date: 2024-05-29
---
> [!info]- 참고한 것들
> - [[11. TLS|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]

## De-facto Internet Security Standard

- 이제는 말하지 않아도 다들 아는 통신 보안 프로토콜
	- 이전의 SSL 프로토콜을 개선해서 표준화한 것이라 한다.
	- [[Public Key Infrastructure X509, PKIX (PKIX)|PKIX]] 를 활용한다.
- 대략적으로 다음과 같이 쪼개어 볼 수 있다고 한다.
	- Handshake Protocol: 비대칭키를 이용해 대칭키를 교환하기 위한 과정
	- Record Protocol: 교환한 대칭키를 활용하는 과정
		- Alert Protocol: 에러 핸들링
		- Change Cipher Spec Protocol: Handshake 이후 비대칭키 -> 대칭키 로 전환되는 과정

## 과정 (TLS 1.2 기준)

![[Pasted image 20240529015625.png]]

### `Hello`: Version Negotiation

- `Hello` 부분은 Client 와 Server 간에 사용하고자 하는 TLS 버전 및 암호 알고리즘 (Suite) 을 조율하는 부분이다.
- C -> S: `ClientHello`
	- 여기서 client 가 먼저 자신이 사용할 수 있는 TLS 버전과 Suite 를 제시한다.
- S -> C: `ServerHello`
	- 그러면 server 는 `ClientHello` 를 받아서 자신이 사용할 수 있는 것들과 비교해 server 와 client 가 모두 사용할 수 있는 (1) 제일 최신의 TLS 버전과 (2) 제일 보안수준이 높은 Suite 를 고른다.
	- 그리고 `ServerHello` 로 "이것으로 합시다" 라며 합의를 보는 것.

### `KeyExchange`: Shared Secret

- `KeyExchange` 는 서로에게 키를 제공하는 과정이다.
- S -> C: `Certificate` (+ 추가적으로, `ServerKeyExchange`)
	- 기본적으로 server 는 자신의 [[Certificate (PKIX)|인증서]]를 꺼내보이며 여기에 들어있는 pubkey 를 client 가 사용하게 한다.
	- 근데 추가적으로 다른 pubkey 를 꺼낼 수도 있다. (`ServerKeyExchange`)
		- 아마 cert 에 있는 것과 다른 pubkey 를 사용하고자 할 때 이런 짓을 할거다.
	- 또한, 이 인증서를 이용해 server 는 자신의 신원을 인증한다.
		- 선택적으로 client 도 자신의 인증서를 꺼내며 신원을 인증하기도 한다.
		- 물론 흔히 있는 경우는 아니다. ([[Mutual TLS, mTLS (PKIX)|mTLS]])
- C -> S: `ClientKeyExchange`
	- Client 는 secret 을 하나 생성한 후, server 가 제시한 pubkey 로 이것을 암호화해 보낸다.
	- 이 secret 은 *Pre-master Secret* 라고도 불리며, 이 *Pre-master Secret* 으로 *Master Secret* 을 생성하고, 마지막으로 이것으로 AES 와 같은 대칭키를 생성한다.
	- 즉, 여기까지 오면 client 와 server 모두 동일한 key 를 가지고 있게 되는 것.

### `Finished`: Handshake Integrity

- 이 `Finished` 전까지의 모든 과정은 plaintext 기반으로 이루어 진다.
- 만약에 중간에 MITM 가 있어서 이 plaintext 를 변조했을 가능성을 없애기 위해
	- 주고받은 모든 메세지를 [[Hash (Hash)|hash]] 하고
	- 이것을 shared symmetric key 로 암호화해서 서로에게 보내어 비교하는 `Finished` 과정을 거치게 된다.
- 즉, 이 둘이 같지 않으면 중간에 뭔가 변조가 이루어졌다는 것.
- `Finished` 과정은 암호화되어 이루어 지기에, attacker 가 이것까지 중간에서 변조해서 발각되는 것을 방지하는 것은 현실적으로 불가능하다.