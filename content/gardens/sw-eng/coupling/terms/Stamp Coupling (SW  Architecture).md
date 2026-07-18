---
tags:
  - mdg
  - sw-eng
  - coupling
date: 2026-07-18
aliases:
  - Stamp Coupling
  - 스탬프 결합도
---
> [!info] 작물단계: #seed

> [!info]- 참고한 것들
> - [[07. 아키텍쳐 디자인|충남대 김현수 교수님 소프트웨어공학 강의 (Fall 2021)]]

## 란?

- *Stamp Coupling* (*스탬프 결합도*) 는 매개변수로 object 나 struct 를 주는 경우인데, 중요한 건 저 object/struct 내의 모든 field 를 사용하지 않을 때를 말한다.
- 그럼 사용하지 않는 field 는 불필요하게 노출되는 것이므로 문제가 있다는 것.

## 해결방법

- 이걸 해결하기 위해서는
	- 뭉쳐서 주지 말고 하나하나 원시자료형으로 나눠서 주거나
	- 필요한 field 에만 접근할 수 있도록 하는 interface 를 제공하는 것이다.
		- Postgres 나 glib 같은데 보면 공통의 field 가 들어있는 여러 struct 가 정의되어 있는데, 그 struct 들이 이런 interface 역할을 한다고 이해하면 된다.
		- 즉, 어떤 메모리 공간이 해당 struct 로 cast 된 경우에는 그 struct 에 있는 놈들만 접근할 수 있기 때문에 전체가 아닌 일부만을 공개할 수 있다.