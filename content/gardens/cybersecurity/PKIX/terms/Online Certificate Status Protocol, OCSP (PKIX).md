---
tags:
  - 용어집
  - Security
  - PKIX
date: 2024-05-27
---
> [!info]- 참고한 것들
> - [[7. PKC|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]
> - [위키피디아](https://en.wikipedia.org/wiki/Online_Certificate_Status_Protocol)

## 소개

- [[Certificate Revocation List, CRL (PKIX)|CRL]] 과 유사하게 [[Certificate (PKIX)|인증서]] 가 revoke 되었는지 여부를 확인하는 데 사용되는 프로토콜이다.

![[Pasted image 20240528002834.png]]

- 대충 이런 식으로 작동한다고 한다:
	- [[Certificate Authority, CA (PKIX)|CA]] 혹은 CA 가 위임한 어떤 단체가 OCSP 서버 (*OCSP Responder*) 를 운영한다.
	- Client 가 server 의 인증서를 받아들고 OCSP 서버에게 이 인증서가 revoke 되었는지 물어보는 형태로 진행된다.
		- 그럼 OCSP 서버는 CA 에게 달려가 이놈이 revoke 되었는지 물어보고, client 에게 답변한다.
		- 이때는 인증서의 고유한 ID 격인 [[Serial Number (PKIX)|Serial Number]] 을 이용해 CA 에게 물어본다.
	- CRL 과의 차이점은 OCSP 서버가 revoked certificate 들을 모아다가 공개하는 방식이 아니어서 실시간 반영이 안된다는 기존의 CRL 의 문제가 해결된다고 한다.
- 하지만 여기에는 몇가지 문제가 있다고 한다.
	- 첫번째 문제는 OCSP 서버는 client 가 어디 방문했는지 추적할 수 있기 때문에 privacy 문제가 있다는 것이다.
		- 이것은 *Stapling* 이라는 것으로 해결한다: client 가 OCSP 에 물어보는 것이 아니고 웹서비스 server 가 자신의 인증서가 revoke 되었는지 OCSP 에 물어보는 것
	- 두번째 문제는 OCSP 서버에 접근하지 못할 경우 client delay 가 걸리게 된다는 것이다.
		- 이것은 *soft-fail* 방식으로 타협한다: 응답이 안오면 문제가 없는 것으로 판단한다는 것