---
tags:
  - mdg
  - sw-eng
  - design-patterns
  - behavior-pattern
date: 2026-07-17
aliases:
  - Command Pattern
---
> [!info] 작물단계: #seed

> [!info]- 참고한 것들
> - [[08. 디자인 패턴|충남대 김현수 교수님 소프트웨어공학 강의 (Fall 2021)]]

## 란?

- 여기서 *Command* 는 '인터페이스' 정도로 생각하면 된다.
- 즉, *Command Pattern* 은 ==인터페이스를 동일하게 맞추고, 구체적 행위는 객체에게 맡기는== 방식이다.
- 대표적인게 Go 이다.
	- Go 는 C 답게 class 따윈 없고 struct 만 있다.
	- 근데, C 와 다르게 이 struct 에 interface 를 부여할 수 있도록 하고 있다.
	- 그래서 Go 에서는 여러 struct 에 대해 동일한 interface 를 부여하고, 구체적으로 어떤 동작을 할 것인지는 그 struct 내에서 구현하도록 하는 이 *Command Pattern* 을 '경장히 많이' 사용한다.