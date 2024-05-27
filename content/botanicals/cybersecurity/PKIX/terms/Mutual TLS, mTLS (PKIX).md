---
tags:
  - 용어집
  - PKIX
date: 2023-12-21
---
> [!info] [참고한 글](https://www.cloudflare.com/learning/access-management/what-is-mutual-tls/)
## 용어 설명

- 기존의 Server [[Certificate (PKIX)|cert]] 로만 암호화 통신을 진행하던 [[Transport Layer Security, TLS (Network)|TLS]] 와 달리,
- Server cert 와 Client cert 모두 사용해서 암호화 통신을 제공하는 방법이다.

### 장점?

- 이걸 사용해서 좋은점 중에 하나는, Token 혹은 Password 같은 기존의 인증수단에 추가적인 방어막을 하나 더 칠 수 있다는 것이다.
	- 예를 들어 Brute force attack 이나 Phishing attack 과 같은 방법으로 Password 가 노출되었을 때, 이 탈취한 Password 로 접근하는 것을 막을 방법이 (뭐 Password 를 변경하는 것 이외에는) 없었는데
	- 만약 mTLS 를 이용하게 되면 Password 이외에도 Client 의 TLS 인증서와 개인키까지 있어야 서버에 인증할 수 있기 때문에 이러한 공격에서 더 안전할 수 있다.

### 단점?

- 단점이라기 보다는 왜 일반적인 통신에서는 mTLS 가 아니라 TLS 를 사용하는 이유에 대해 생각해 보자
	- mTLS 를 사용하기 위해서는 Client 한테도 TLS 인증서가 있어야 하잖어?
	- 근데 내가 노트북에서 접속할 때랑 핸드폰에서 접속할 때 모두 인증이 가능하게 하려면 노트북과 핸드폰이 같은 Client 인증서 를 공유하거나
	- 각각 Client 인증서를 생성해야 하는데 이건 딱 봐도 관리가 여간 복잡한 게 아니기 때문이다.

## 작동 방식

### 기존 TLS 작동 방식

- 간단히 살펴보면,
	1. 클라이언트가 서버 접속
	2. 서버가 TLS 인증서 제시
	3. 클라이언트가 서버의 TLS 인증서를 (제 3의 기관을 통해) 신뢰할 수 있는지 검증
	4. 암호화 통신 시작
- 인 반면, mTLS 는 여기에 추가적인 step 이 붙는다.

### mTLS 작동 방식

- 저 [참고한 글](https://www.cloudflare.com/learning/access-management/what-is-mutual-tls/) 에서 처럼 추가적인 step 에 bold 처리를 해서 보면, 다음처럼 수행된다
	1. 클라이언트가 서버 접속
	2. 서버가 TLS 인증서 제시
	3. 클라이언트가 서버의 TLS 인증서를 (제 3의 기관을 통해) 신뢰할 수 있는지 검증
	4. **클라이언트가 TLS 인증서 제시**
	5. **서버가 클라이언트의 TLS 인증서를 (제 3의 기관을 통해) 신뢰할 수 있는지 검증**
	6. **서버가 클라이언트의 접속을 허용**
	7. 암호화 통신 시작