---
tags:
  - mdg
  - sw-eng
  - design-patterns
  - behavior-pattern
date: 2026-07-19
aliases:
  - Visitor Pattern
  - Double Dispatch
---
> [!info] 작물단계: #seed

> [!info]- 참고한 것들
> - [[08. 디자인 패턴|충남대 김현수 교수님 소프트웨어공학 강의 (Fall 2021)]]
> - [리팩토링 구루 - 이친구 잘하네](https://refactoring.guru/design-patterns/visitor)

## Problem Statement

- 기능을 하나 추가한다고 해보자. 이걸 `act()` 라고 해보자.
- 근데 이 기능이 구현되어야 할 Class 가 여러개 있다. 가령 `A`, `B`, `C` 이 세 개가 있다고 해보자.
- 이때 가장 쉽게 떠올릴 수 있는 접근 방법은 interface 를 수정하고, 각 Class 에 이걸 구현해 주는 것이다.
	- 가령 `A`, `B`, `C` 에 대한 interface `Iface` 가 있다고 해보자.
	- 그럼 이 `Iface` 에 `Iface::act()` 를 추가한다.
	- 그리고 `A`, `B`, `C` 에 `A::act()`, `B::act()`, `C::act()` 를 구현한다.
- 근데 이때 문제가 있다.
	- 우선, `A`, `B`, `C` 가 이미 production 상태라 얘네를 직접 고치는건 위험할 수 있다.
	- 그리고 이렇게 하면 이와 유사한 상황이 될 때마다 `Iface`, `A`, `B`, `C` 를 다 고쳐야 한다.
- 이런 상황에 사용하기 위해 *Visitor Pattern* 이 등장한다.

## Solution

- *Visitor Pattern* 은 원하는 기능에 대한 각 Class 별 구현을 모아둔 *Visitor* Class 를 만들어 위와 같은 문제를 해결하는 방법이다.
- 뭔소린지 위의 상황을 가지고 예를 들어보자.

### Visitor Class

- 우선 `act()` 에 대한 *Visitor* Class `ActVisitor` 를 만들자. 여기에는 다음의 세 method 가 있다.
	- `ActVisitor::forA(A a)`: `A` 를 위한 구현 (`A::act()` 대신 여기에 구현)
	- `ActVisitor::forB(B b)`: `B` 를 위한 구현 (`B::act()` 대신 여기에 구현)
	- `ActVisitor::forC(C c)`: `C` 를 위한 구현 (`C::act()` 대신 여기에 구현)
- 즉, 이렇게 하면 `ActVisitor::forA(A a)` 를 호출했을 때 `A::act()` 를 호출한 것과 동일한 효과를 얻게 된다.
- 근데 이렇게만 하면 문제가 있다.
	- [[#Problem Statement|위]] 에서 보면, `Iface::act()` 를 뚫었으므로 caller 입장에서는 `오브젝트.act()` 를 호출하면 [[Polymorphism ( Object Oriented Programming)|Polymorphism]] 으로 해당 객체의 작업이 실행되게 할 수 있었다.
	- 근데 이 `ActVisitor` 를 사용하려면, caller 입장에서는 object 가 어떤 Class 인지를 알아내야 한다.
		- Java 문법으로는 `if (me instanceof A) { ActVisitor::forA((A)obj); }` 이딴식으로 해야 한다.
- 이 문제를 해결하기 위해 *Visitor Pattern* 에서는 *Double Dispatch* 라는 기법을 사용한다.

### Double Dispatch

- 이걸 위해서는 인터페이스와 각 Class 에 딱 하나 수정을 해야 한다. `accept()` 라는 method 를 추가하는 것.
	- 수정 안하려고 *Visitor Pattern* 을 쓴다며?? 라고 생각한다면, [[#확장성|뒤]] 에서 설명할테니 기다려보시라.
- 이렇게 `accept(ActVisitor v)` 를 추가한다.
	- `iface::accept(ActVisitor v)`
	- `A::accept(ActVisitor v) { v.forA((A)this); }`
	- `B::accept(ActVisitor v) { v.forB((B)this); }`
	- `C::accept(ActVisitor v) { v.forC((C)this); }`
- 그럼 Class `A` 에 대한 object `obj` 에 대해, `obj.accept(v)` 를 하면 자연스레 `A::accept(ActVisitor v)` 가 호출되고 이어서 `v.forA((A)this)` 가 호출된다.
- 즉, 이 `accept()` 를 사용하면 Class 를 파악하는 코드를 짤 필요가 없다.

### 확장성

- 위에서도 말한것처럼, *Visitor Pattern* 은 원래의 Class 에 손을 안대게 하기 위함이었다. 근데 *Double Dispatch* 를 하려면 `accept()` 를 추가해야되니 어쨋든 손을 대긴 해야 한다.
- 이건 이렇게 방어할 수 있다.
	- `accept()` 의 코드를 보면 알겠지만, *Visitor* 의 method 를 호출하는 것 하나가 전부다. 그래서 이거 하나 추가하는 것은 원래의 Class 에 아무런 영향을 주지 않는다.
	- 그리고 아래서 설명할 *Visitor Interface* 를 사용하면, 추후에 다른 *Visitor* 들이 추가되어도 Class 는 변경하지 않아도 된다.
- 두번째 이유가 중요하다. *Visitor* 에 대해서도 polymorphism 을 해서, *Visitor Interface* 를 사용하자는거다.
- 위에서의 예시에서, *Visitor* 을 위한 interface 를 하나 정의해보자. 이놈을 `IfaceVisitor` 라고 해보자.
	- `IfaceVisitor::forA(A a)`: `ActVisitor::forA(A a)` 의 추상화
	- `IfaceVisitor::forB(B a)`: `ActVisitor::forB(B a)` 의 추상화
	- `IfaceVisitor::forC(C a)`: `ActVisitor::forB(B a)` 의 추상화
- 그럼 각 Class 에는 `accept()` 를 이렇게 구현해놓으면 된다.
	- `Iface::accept(IfaceVisitor v)`
	- `A::accept(IfaceVisitor v)`
	- `B::accept(IfaceVisitor v)`
	- `C::accept(IfaceVisitor v)`
- 위에서의 예시 실행 흐름을 가져와보면 다음과 같이 된다.
	- `Iface obj = new A()` 와 `IfaceVisitor v = new ActVisitor()` 가 있다고 해보자.
	- `obj.accept(v)` call
	- Polymorphism 으로 `A::accept(v)` 실행
	- `v.forA((A)obj)` call
	- Polymorphism 으로 `ActVisitor::forA((A)obj)` 실행
- 여기에 다른 *Visitor* 를 하나 더 추가해보자. 가령 `play()` 라는 기능에 대해 `PlayVisitor` 를 추가해보자.
	- `PlayVisitor::forA(A a)`: `A` 를 위한 `play()` 의 코드
	- `PlayVisitor::forB(B b)`: `B` 를 위한 `play()` 의 코드
	- `PlayVisitor::forC(C c)`: `C` 를 위한 `play()` 의 코드
- 그럼 이때는 `A`, `B`, `C` Class 에 털끝하나 건들 것 없이 그냥 사용할 수 있다.
	- `Iface obj = new A()` 와 `IfaceVisitor v = new PlayVisitor()` 가 있다고 해보면,
	- `obj.accept(v)` call 을 하면 polymorphism 으로 `A::accept(v)` 가 실행된다.
	- 여기에서 `v.forA((A)obj)` call 을 하면 polymorphism 으로 `PlayVisitor::forA((A)obj)` 가 실행된다.