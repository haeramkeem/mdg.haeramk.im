---
tags:
  - arch
  - arch-cpu
aliases:
  - Register Renaming
date: 2025-04-28
---
> [!info]- 참고한 것들
> - [[03. Tomasulo's Algorithm and Branch Prediction|서울대 유승주 교수님 고급 컴퓨터 구조 강의 (Spring 2025)]]

## Register Renaming

- *Register Renaming* 이라는 것은 다른 [[Register (Arch)|Register]] 를 이용해서 [[Dependence (Arch)|Dependence]] 를 해소하는 것이다.
- 가령 아래의 코드에는 `F6` 에 대해 [[Data Dependence (Arch)|WAW dependence]] 가 있고 `F8` 에 대해서는 [[Data Dependence (Arch)|WAR dependence]] 가 있다.

![[Pasted image 20250427162151.png]]

- 이때, `S.D` 와 `MUL.D` 의 `F6` 을 각각 `T`, `V` 라는 별도의 register 를 이용하고 `SUB.D` 와 `MUL.D` 의 `F8` 을 `U` 라는 register 로 변경하면

![[Pasted image 20250427162203.png]]

- 위처럼 WAW 와 WAR 모두 해소되는 것을 알 수 있다.
	- 물론 위의 예제에서는 `SUB.D` 와 `MUL.D` 간의 [[Data Dependence (Arch)|RAW dependence]] 는 여전히 남아있다.