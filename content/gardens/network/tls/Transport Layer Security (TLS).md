---
tags:
  - terms
  - network
  - tls
date: 2024-05-29
---
> [!info]- 참고한 것들
> - [[11. TLS|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]
> - [CloudFlare](https://blog.cloudflare.com/rfc-8446-aka-tls-1-3)

## De-facto Internet Security Standard

- 이제는 말하지 않아도 다들 아는 통신 보안 프로토콜
	- 이전의 SSL 프로토콜을 개선해서 표준화한 것이라 한다.
	- [[Public Key Infrastructure X509, PKIX (PKIX)|PKIX]] 를 활용한다.
- 대략적으로 다음과 같이 쪼개어 볼 수 있다고 한다.
	- Handshake Protocol: 비대칭키를 이용해 대칭키를 교환하기 위한 과정
	- Record Protocol: 교환한 대칭키를 활용하는 과정
	- Alert Protocol: 에러 핸들링
	- Change Cipher Spec Protocol: Handshake 이후 비대칭키 -> 대칭키 로 전환되는 과정

## 과정 (overview)

- TCP 3-Way Handshake 가 종료되어 Connection established 된 이후에 실행된다.
1. _Client Hello_ → 클라이언트가 TLS Handshake를 개시하는 단계
    - 클라이언트가 사용할 수 있는 TLS 버전과 암호 알고리즘 + _Client Random_ 을 송신한다.
2. _Server Hello_ → 서버가 Client Hello 에 응답하며 인증서를 제공하는 단계
    - 서버는 Certificate 와 서버가 결정한 (클라이언트가 보낸 알고리즘 중에서 서버가 사용할 수 있고 앞으로의 통신에서 사용할) 암호 알고리즘 + _Server Random_ 을 송신한다.
3. Authentication → 클라이언트가 수신한 Certificate 를 검증하는 단계
    - Certificate 를 인증업체에 보내 신뢰할 수 있는 서버인지 확인하고, RSA Pubkey 를 받는다.
4. The premaster secret → 클라이언트가 서버에게 RSA Pubkey 이용한 문제를 내는 단계
    - 클라이언트는 _Premaster secret(예비 마스터 암호)_ 를 생성하고 Authenticate 를 통해 알아낸 RSA Pubkey 를 통해 암호화하여 서버한테 보낸다.
    - 해당 Pubkey 에 대한 Privkey 를 서버가 갖고 있는지 (그걸로 복호화할 수 있는지) 시험하는 것
5. Session key creation → 클라이언트와 서버가 세션키(대칭키이다)를 생성하는 단계
    - 세션키는 _Client Random_, _Server Random_, _Premaster secret_ 세가지 값을 이용해 생성된다.
    - 당연히 서버는 _Premaster secret_ 을 얻기 위해 암호화된 값을 복호화해야 한다.
6. _Client ready_ → 클라이언트는 _Finished_ 메세지를 세션키로 암호화해서 송신한다.
7. _Server ready_ → 서버 또한 _Finished_ 메세지를 세션키로 암호화해서 송신한다.
8. Handshake 가 완료되고 이후의 통신은 전부 세션키로 암호화되어 수행된다.

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

## TLS 1.3, RFC8446

### 1-RTT mode

- TLS 1.3 에서는 기존의 RTT 를 2번 필요로 하던 것을 1번으로 줄이는 1-RTT 를 지원한다.
- 가령 기존의 TLS 1.2 에서 [[Diffie-Hellman Key Exchange, DH (PKC)|DH]] 를 사용하는 flow 는 다음과 같다.

![[Pasted image 20240529093309.png]]
> 출처: [CloudFlare](https://blog.cloudflare.com/rfc-8446-aka-tls-1-3)

- 보면, 첫번째 `ClientHello` 에서 DH 를 사용하자고 server 에게 알렸을 때, server 는 DH key 를 생성해서 전달해 주게 된다.
- 이것이 TLS 1.3 에서는 아래처럼 바뀐다.

![[Pasted image 20240529093557.png]]
> 출처: 이것도 [CloudFlare](https://blog.cloudflare.com/rfc-8446-aka-tls-1-3)

- TLS 1.3 에서는 사용할 수 있는 키 알고리즘의 선택의 폭을 확 줄였다. (ECDHE w/ X25519 혹은 P-256) 
- 따라서 `ClientHello` 에서 version negotiation 과정 없이 바로 사용할 DH pubkey 를 server 에게 전달하고, server 도 DH pubkey 를 전달하게 되어 1번의 RTT 로 key exchange 가 종료된다.

### 0-RTT resumption

- 사용자들은 한번 접속한 웹페이지를 추후에 다시 방문할 가능성이 높다.
- 따라서, 처음에 connection 을 맺었을 때, *Resumption Main Secret* 이라는 것을 생성하게 되고, 이후에의 재방문에는 이것을 이용해 Key exchange 없이 0번의 RTT 로 바로 암호 연결을 하게 된다.

#### Replay attack

![[Pasted image 20240529095658.png]]

> 출처: [또라우드플레어](https://blog.cloudflare.com/rfc-8446-aka-tls-1-3)

- 이 0-RTT 의 치명적인 단점은 replay attack 이다.
- 0-RTT 모드에서 server 의 상태를 바꾸는 (예를 들어 DB 의 `INSERT` transaction) 패킷을 보냈다고 해보자.
- 이때 attack 가 이 패킷을 캡쳐한 뒤 server 에 동일하게 보내면, server 는 이것을 attacker 가 보냈다는 것을 알 수가 없다.
- 물론 attacker 는 패킷이 암호화되어 있기 때문에 어떤 내용인지는 알 수 없지만, 기존에는 만료된 연결이기에 server 가 거부할 수 있었다면 0-RTT 의 경우에는 불가능해지는 것.
- 따라서 HTTP `POST` 와 같은 server 의 상태를 바꾸는 요청은 0-RTT 로 보내지 않고, `GET` 같은 요청만을 0-RTT 로 보낸다고 한다.

### Cipher Suites

- TLS 1.3 에서는 다음과 같은 Cipher Suite 를 지원한다고 한다.
	- `TLS_AES_256_GCM_SHA384`
	- `TLS_CHACHA20_POLY1305_SHA256`
	- `TLS_AES_128_GCM_SHA256`
	- `TLS_AES_128_CCM_8_SHA256`
	- `TLS_AES_128_CCM_SHA256`