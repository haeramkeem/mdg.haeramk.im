---
tags:
  - mdg
  - sw-eng
  - coupling
date: 2026-07-18
aliases:
  - Type Use Coupling
  - 타입 사용 결합도
---
> [!info] 작물단계: #seed

> [!info]- 참고한 것들
> - [[07. 아키텍쳐 디자인|충남대 김현수 교수님 소프트웨어공학 강의 (Fall 2021)]]

## 란?

- *Type Use Coupling* (*타입 사용 결합도*) 는 다른 모듈에서 정의된 자료형 (`typedef` 생각하면 된다) 을 갖다 사용하는 경우이다.
	- 그 '다른 모듈' 에서 자료형 정의를 바뀌면 나도 영향을 받기 때문.