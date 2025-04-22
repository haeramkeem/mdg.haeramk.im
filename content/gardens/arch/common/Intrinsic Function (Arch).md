---
tags:
  - arch
  - terms
aliases:
  - Intrinsic Function
  - intrinsic
date: 2024-09-04
---
> [!info]- 참고한 것들
> - [위키](https://en.wikipedia.org/wiki/Intrinsic_function)

## 란?

- 간단하게 말하면 instruction 을 high-level language function 으로 wrapping 해놓은 내장 함수라고 생각하면 된다.
- 명확히는, *Intrinsic Function* 은 "Compiler" 에 의해 구현되는 함수를 일컫는다.
	- 즉, 일반적인 내장함수들은 어딘가에 해당 언어로 구현되어 있지만, intrinsic function 은 compiler 가 compile time 에 구현한다는 것.
	- 다만 이것은 pre-built (pre-compiled) function 은 아니다. Pre-built function 은 이미 compile 되어 시스템 어딘가에 저장되어 있는 것을 불러오는 형태로 작동한다.
- 컴파일러가 intrinsic function 을 구현할 때는 여러가지 요소를 고려하여 구현한다.
	- 해당 기능을 수행해 주는 instruction 을 지원하는 CPU 라면, 그냥 그 instruction 하나로 구현해 주고
	- 만약 지원하지 않는다면, 지원하는 instruction 들로 해당 기능을 emulate 하는 식으로 구현해 준다.