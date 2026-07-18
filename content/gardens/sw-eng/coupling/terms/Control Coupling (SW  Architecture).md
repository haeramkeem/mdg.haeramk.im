---
tags:
  - mdg
  - sw-eng
  - coupling
date: 2026-07-18
aliases:
  - "Co\bntrol Coupling"
  - 제어 결합도
---
> [!info] 작물단계: #seed

> [!info]- 참고한 것들
> - [[07. 아키텍쳐 디자인|충남대 김현수 교수님 소프트웨어공학 강의 (Fall 2021)]]

## 란?

- 함수가 어떻게 작동할지를 '매개변수로' 주는 경우 *Control Coupling* (*제어 결합도*) 가 높다고 한다.
- 대표적인게 매개변수로 `bool` flag 를 주는 경우이다.

## 해결 방법

- 이를 피하려면
	- Caller 쪽에서 `if` branch 를 사용해서 나누거나
	- [[Command Pattern (Design Patterns)|Command Pattern]] 혹은 [[Polymorphism ( Object Oriented Programming)|다형성]] 을 이용하는 것이다.