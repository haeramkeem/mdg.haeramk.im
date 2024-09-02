---
tags:
  - pl
  - pl-optimization
  - terms
date: 2024-09-02
aliases:
  - Instruction Scheduling
  - Code Scheduling
  - Code Hoisting
  - Code Sinking
---
> [!info]- 참고한 것들
> - [위키 - Code Motion](https://en.wikipedia.org/wiki/Code_motion)
> - [위키 - Instruction Scheduling](https://en.wikipedia.org/wiki/Instruction_scheduling)
> - [[15. Machine Dependent Processing#Instruction Scheduling|충남대 조은선 교수님 컴파일러 강의 (Fall 2021)]]

## 란?

- Instruction 은 pipeline 으로 실행되기 때문에, 동시에 여러개의 instruction 이 각기 다른 stage 로 실행된다.
- 하지만 바로 이전 instruction 의 실행 결과를 사용해야 하는 경우라면 해당 instruction 이 끝날때 까지는 이후 instruction 이 실행될 수 없을 것이다.
- 따라서 [[Code Motion (PL)|코드의 실행 순서를 바꿔서]] 이러한 의존성이 있는 instruction 을 연달아 실행하는 것이 아닌 간격을 좀 두어서 (즉, 이전 instruction 을 처리하는 동안은 의존성이 없는 다른 instruction 을 처리하는 것으로 순서를 바꿔서) pipeline 될 수 있게 하는 방법이 *Instruction Scheduling* 이다.
	- 이놈은 여러가지 용어로 불린다: *Code Scheduling*, *Code Hoisting*, *Code Sinking*
- 다음의 예시를 보자.

![[Pasted image 20240902161430.png]]
> 출처: [위키](https://en.wikipedia.org/wiki/Code_motion#/media/File:Preventing_dependency_stalls_in_assembled_code_with_code_movement.jpg)

- 위 다이어그램에서 화살표는 dependency 를 나타낸다. 즉, 화살표의 head 에 있는 놈은 tail 에 있는 놈의 결과를 사용한다 (의존한다) 는 것.
- 왼쪽의 `a.` 상태에서는 instruction 들이 바짝 붙어있기 때문에 pipeline 이 힘들다. 하지만 이것을 오른쪽의 `a'.` 로 바꾸면 중간중간 다른 instruction 이 실행되어 pipeline 이 가능하지만, 결과는 그대로인 것을 알 수 있다.