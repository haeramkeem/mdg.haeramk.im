---
tags:
  - mdg
  - sw-eng
  - cohesion
date: 2026-07-18
aliases:
  - Layer Cohesion
  - 계층적 응집도
  - Layered Architecture
---
> [!info] 작물단계: #seed

> [!info]- 참고한 것들
> - [[07. 아키텍쳐 디자인|충남대 김현수 교수님 소프트웨어공학 강의 (Fall 2021)]]

## 란?

- *Layered Architecture* 은 '계층' 별로 모듈들을 묶는 것을 의미한다.
	- 이 '계층' 에는 비슷한 기능을 하는 모듈들만이 들어가있다.
	- '상위계층' 에서 '하위계층' 을 인터페이스를 통해 호출할 수 있고, '하위계층' 은 그 결과를 '상위계층' 에 반환한다.
		- 여기서 ==반대방향은 안된다==. 즉, '하위계층' 에서 '상위계층' 을 호출할 수는 없다.
- 이렇게 하면 계층간 인터페이스가 유지되는 한 '상위계층' 에서는 그냥 그것을 호출하기만 하면 되고, '하위계층' 에서 실제로 어떻게 작동하는지는 '하위계층' 에서 적절히 모듈을 선택하기만 하면 된다.
	- 대부분의 것들이 이런 *Layered Architecture* 를 사용한다.
	- 가령 [[Database Management System, DBMS (Database)|DBMS]] 나 [[OSI 7 Layer Model (Network)|네트워크의 OSI 7 계층]] 같은 것들.
- 그리고 이렇게 계층화가 잘 되어있을 때 *Layer Cohesion* (*계층적 응집도*) 가 높다고 한다.