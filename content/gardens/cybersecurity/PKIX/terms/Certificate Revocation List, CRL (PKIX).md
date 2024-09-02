---
tags:
  - terms
  - security
  - pkix
date: 2024-05-27
---
> [!info]- 참고한 것들
> - [[7. PKC|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]
> - [위키피디아](https://en.wikipedia.org/wiki/Certificate_revocation_list)

## CRL: Certificate Revocation Lists

- [[Certificate (PKIX)|인증서]] 를 발급하는 [[Certificate Authority, CA (PKIX)|CA]] 가 공개하는 revoked certificate 리스트를 일컫는다.
	- 인증서 소유자는 CA 에게 이 인증서를 revoke 해달라고 요청할 수 있는데
	- 그럼 CA 는 이러한 정보들을 모아다가 CRL 로 만들어서 공개하는 방식이다.

![[Pasted image 20240528002525.png]]

- 클라이언트는 서버에 접속할 때 받은 인증서를 검증하는 과정에서 이 CRL 을 다운받아 이 인증서가 revoke 되지 않았는지 확인한다.
- CRL 이 자주 업데이트되지 않으면 인증서가 revoke 되었다는 것을 나중에 알기 때문에 CRL 업데이트 주기를 짧게 가져간다고 한다.