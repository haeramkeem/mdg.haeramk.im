---
tags:
  - mdg
  - sw-eng
  - cohesion
date: 2026-07-18
aliases:
  - Procedural Cohesion
  - 절차적 응집도
---
> [!info] 작물단계: #seed

> [!info]- 참고한 것들
> - [[07. 아키텍쳐 디자인|충남대 김현수 교수님 소프트웨어공학 강의 (Fall 2021)]]

## 란?

- 프로시저들이 연달아 실행될 때 *Procedural Cohesion* (*절차적 응집도*) 가 높다고 한다.
	- [[Sequential Cohesion (SW  Architecture)|Sequential Cohesion]] 과의 차이점은, 이놈은 연달아 실행되어야 하기도 하지만 그 프로시저들 간에 ==데이터 의존관계== 가 있어야 한다. 근데 *Procedural Cohesion* 은 데이터로 연결되어있지 않고 그냥 쭉 실행되기만 해도 된다.