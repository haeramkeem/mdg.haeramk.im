---
tags:
  - pl
  - pl-func
aliases:
  - First-class citizen
  - Second-class citizen
  - First-order function
  - High-order function
date: 2024-10-03
---
> [!info]- 참고한 것들
> - [[09. 함수와 함수호출|충남대 이성호 교수님 프로그래밍언어개론 강의 (Spring 2022) - 9강]]
> - [[10. 1등 시민 함수|충남대 이성호 교수님 프로그래밍언어개론 강의 (Spring 2022) - 10강]]

## First-class (= High order), Second-class (= First order)

- 서로 반대의 개념인데
- *First-class Citizen* (*High-order function*) : 함수형 기능을 지원하는 언어처럼 함수를 하나의 객체로 취급해 인자로 받을 수 있고 함수를 반환하는것도 가능
- *Second-class Citizen* (*First-order function*) : [[Function Pointer (C Type)|C 언어처럼]] 함수를 인자로 받지도 못하고 함수를 반환하지도 못하는 특성
	- 함수를 객체 / 변수와 별도로 취급함
	- 변수와 별도로 취급하기 때문에 변수를 저장하는 추상 메모리와 별도로 추가로 함수를 저장할 추상 메모리가 필요함
