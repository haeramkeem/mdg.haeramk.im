---
tags:
  - mdg
  - sw-eng
  - cohesion
date: 2026-07-18
aliases:
  - Communicational Cohesion
  - 교환적 응집도
---
> [!info] 작물단계: #seed

> [!info]- 참고한 것들
> - [[07. 아키텍쳐 디자인|충남대 김현수 교수님 소프트웨어공학 강의 (Fall 2021)]]

## 란?

- 한 모듈에 데이터를 저장하고 그 모듈이 이 데이터를 조작하기 위한 기능들만을 제공할 때 *Communicational Cohesion* (*교환적 응집도*) 가 높다고 한다.
	- [[Functional Cohesion (SW  Architecture)|Functional Cohesion]] 과 헷갈린다면, 이건 모듈이 '하나의 기능' 을 제공하는거고 *Communicational Cohesion* 은 '데이터를 조작하는 기능들' 을 제공하는거다.
- 대표적인게 Class 이다.
	- Class 에는 field 로써 데이터를 저장하고, 그것을 조작할 수 있는 method 들을 제공한다는 점에서 *Communicational Cohesion* 을 보장한다.