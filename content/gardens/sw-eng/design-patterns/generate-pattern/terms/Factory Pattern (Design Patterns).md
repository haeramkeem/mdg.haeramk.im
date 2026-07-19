---
tags:
  - mdg
  - sw-eng
  - design-patterns
  - generate-pattern
date: 2026-07-18
aliases:
  - Factory Pattern
---
> [!info] 작물단계: #seed

> [!info]- 참고한 것들
> - [[08. 디자인 패턴|충남대 김현수 교수님 소프트웨어공학 강의 (Fall 2021)]]
> - [누군가의 블로그](https://velog.io/@ellyheetov/Factory-Pattern)

## 란?

- *Factory* 가 '공장' 이듯이, 이 *Factory Pattern* 은 object 를 생성하는 '공장' 을 두는 방법이다.
- 그럼 [[Constructor (C++ Class)|Constructor]] 랑 뭐가 다르냐? 할텐데, 이 *Factory Pattern* 은 Constructor 를 직접 부르지 못하게 하는 것이 핵심이다.
- 가령 뭐 이런식이다.
	- 만약 Constructor 를 사용한다면, 어떤 object 가 필요할 때 Constructor 를 호출해야 한다.
	- 근데 *Factory Pattern* 을 사용한다면, 어떤 object 가 필요할 때 이 *Factory* 를 호출하되, 매개변수로 어떤 type 을 생성해줘야 하는지 명시하는 셈이다.
		- 이때 이 type 은 `enum` 같은걸로 관리할 수 있다.
- 뭐 왜 이딴짓을 하냐 라고 한다면
	- 어떤 object 를 생성할지를 동적으로 결정할 수 있다.
	- Constructor 는 변경이 잦은 함수이기 때문에, 여기에의 변경이 caller 에게 직접적으로 닿지 않게 할 수 있다고 한다.