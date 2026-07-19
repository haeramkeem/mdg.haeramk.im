---
tags:
  - mdg
  - sw-eng
  - design-patterns
  - generate-pattern
date: 2026-07-17
aliases:
  - Abstract Factory Pattern
---
> [!info] 작물단계: #seed

> [!info]- 참고한 것들
> - [[08. 디자인 패턴|충남대 김현수 교수님 소프트웨어공학 강의 (Fall 2021)]]

## 란?

- [[Factory Pattern (Design Patterns)|Factory Pattern]] 이랑 유사한데, object 를 하나 만드는게 아니고 비슷한놈들을 무더기로 만드는게 *Abstract Factory Pattern* 이다.
	- 그니까 연관성있는 Class 들을 묶어줄 뭔가를 하나 정의한다. 이놈이 *Abstract* 이다.
	- 그리고 이 *Abstract* 를 *Factory* 에 던져주면, 그 연관성있는 Class 들에 대한 object 가 무더기로 나오는 셈이다.