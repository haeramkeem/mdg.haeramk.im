---
tags:
  - arch
  - draft
aliases:
  - Structure hazard
  - Structural hazard
  - Resource conflict
---
> [!info]- 참고한 것들
> - [[05. Dependences and Pipelining|서울대 이재진 교수님 확장형 고성능 컴퓨팅 강의 (Fall 2024)]]
> - [[02. Instruction Level Parallelism|서울대 유승주 교수님 고급 컴퓨터 구조 강의 (Spring 2025)]]

> [!warning]- #draft 본 글은 토막글 상태입니다.
> - [ ] 내용 추가

## Structure Hazard

- 구조 (structure) 적으로 [[Pipeline Hazard (Arch)|Hazard]] 가 발생하는 것인데,
- 구체적으로는 사용하고자 하는 자원 (resouce) 를 지금 당장 사용할 수 없어서 hazard 가 발생하는 것을 의미한다.
	- 여기서 자원은 [[Arithmetic Logic Unit, ALU (Arch)|ALU]] 나 [[Register (Arch)|Register]] 와 같은 HW 를 말한다.
	- 그래서 이것을 *Resource conflict* 라고도 한다.