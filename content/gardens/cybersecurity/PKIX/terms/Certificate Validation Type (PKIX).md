---
tags:
  - 용어집
  - security
  - pkix
date: 2024-05-27
---
> [!info]- 참고한 것들
> - [[7. PKC|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]
> - [Digicert](https://www.digicert.com/difference-between-dv-ov-and-ev-ssl-certificates)

## Certificate 발급의 신뢰도

- [[Certificate Authority, CA (PKIX)|CA]] 가 [[Certificate (PKIX)|인증서]] 를 발급할 때, [[Certificate Chain (PKIX)|End-entity]] 가 이상한 놈이 아닌지 확인하는 작업을 하여 attacker 에게 인증서가 발급되는 것을 방지하는데,
- 이 확인작업을 어떻게 하냐에 따라 다음의 세 가지정도로 구분할 수 있다.
- 발급 난이도는 DV < OV < EV 이며, 당연히 발급이 어려울 수록 신뢰도는 증가한다.
	- 물론 그럼에도 불구하고 CA 가 안일해지면 얼마든지 가짜 인증서를 받는 것이 가능하긴 하다더라.

### Domain Validated (DV)

- 도메인 소유주가 해당 도메인으로 접속했을 때 특정 정보를 반환하도록 하여 도메인을 소유하고 있다는 것을 CA 에게 인증하는 방식을 말한다.
- 가장 간편하고 빠른 방법이지만, 그만큼 신뢰도는 낮다.

### Organization Validated (OV)

- 도메인을 소유하고 있는 것에 추가적으로, 비즈니스 이름, 상태, 사업장의 물리적인 주소 등을 체크한다.

### Extended Validation (EV)

- OV 에서의 검사항목에 추가적으로, 실제로 CA 에서 전화를 걸어 전화번호를 체크하는 등의 까다로운 절차를 거처 인증서를 발급한다.
- 제일 까다롭지만 신뢰성이 강한 인증서로 이 인증서를 받으면 브라우저 주소창이 녹색이 되는 등의 효과가 있다고 하더라.

