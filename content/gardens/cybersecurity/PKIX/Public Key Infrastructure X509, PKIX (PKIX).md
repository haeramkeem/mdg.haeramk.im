---
tags:
  - terms
  - security
  - pkix
date: 2024-05-27
---
> [!info]- 참고한 것들
> - [[7. PKC|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]

## PK*

- PK 로 시작하는 애들 정말 많죠잉
- 딱 정리해보면
	- [[Public Key Cryptography, PKC (PKC)|PKC]]: 비대칭키 암호학 표준
	- PKI: [[Certificate (PKIX)|Certificate]] 관리 프레임워크
	- X509: Certificate 포멧
	- PKIX: X509 포멧을 사용하는 Cert 프레임워크
		- 즉, PKI 는 PKIX 의 superset 으로 X509 를 사용하는 PKI 를 특별히 PKIX 라고 부르는 거다.

> [!tip] [[index|MDG]] 관리 정책
> - 어차피 X509 포맷이 제일 많이 쓰이니깐은,, Certificate 관련 내용은 전부 `PKIX` 라벨 달고 작성될 것입니당