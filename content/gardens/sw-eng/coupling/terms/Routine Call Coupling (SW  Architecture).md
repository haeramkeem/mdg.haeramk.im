---
tags:
  - mdg
  - sw-eng
  - coupling
date: 2026-07-18
aliases:
  - Routine Call Coupling
  - 루틴 호출 결합도
---
> [!info] 작물단계: #seed

> [!info]- 참고한 것들
> - [[07. 아키텍쳐 디자인|충남대 김현수 교수님 소프트웨어공학 강의 (Fall 2021)]]

## 란?

- *Routine Call Coupling* (*루틴 호출 결합도*) 은 한 함수에서 다른 함수를 호출할 때를 의미한다.
- 이건 호출하는 함수의 수가 많을수록 증가한다.
	- 만약 두개 이상의 함수를 계속 호출해야 한다면, 그 함수들을 하나로 합쳐 하나의 함수만 호출하게 하는 것이 이런 *Routine Call Coupling* 을 줄이는데 도움이 된다.