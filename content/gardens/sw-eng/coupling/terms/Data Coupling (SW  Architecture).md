---
tags:
  - mdg
  - sw-eng
  - coupling
date: 2026-07-18
aliases:
  - Data Coupling
  - 데이터 결합도
  - 자료 결합도
---
> [!info] 작물단계: #seed

> [!info]- 참고한 것들
> - [[07. 아키텍쳐 디자인|충남대 김현수 교수님 소프트웨어공학 강의 (Fall 2021)]]

## 란?

- *Data Coupling* (*데이터 결합도* 혹은 *자료 결합도*) 은 원시자료형 혹은 모든 field 를 사용하는 object/struct 을 함수의 매개변수로 받는것을 의미한다.
- 이건 매개변수의 수가 많을수록 증가한다.
	- 그래서 너무 많을 경우에는 struct 로 묶어서 전달하되 ([[Stamp Coupling (SW  Architecture)|Stamp Coupling]] 에서 말한 것처럼) 사용하지 않는 field 가 있을 경우에는 interface 같은걸로 제어를 해야 한다.