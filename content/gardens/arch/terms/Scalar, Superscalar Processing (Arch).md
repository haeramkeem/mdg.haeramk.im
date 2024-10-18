---
tags:
  - arch
  - terms
aliases:
  - ILP
  - Scalar
  - Superscalar
  - Instruction level parallelism
date: 2024-10-18
---
> [!info]- 참고한 것들
> - [[05. Dependences and Pipelining|서울대 이재진 교수님 확장형 고성능 컴퓨팅 강의 (Fall 2024)]]

## Scalar, Vector, Superscalar

- 용어정리를 해보자.
	- *Scalar* 는 한번에 하나의 data 에 대해, 하나의 [[Instruction (Arch)|Instruction]] 을 실행하는 것이다 (Single instruction, single data).
	- *Vector* 는 한번에 여러 data 에 대해, 하나의 instruction 을 실행하는 것이다 ([[Single Instruction Multiple Data, SIMD (Arch)|Single instruction, multiple data]])
	- *Superscalar* 는 말 그대로 scalar 가 여러개 있는 것이다. 즉, 한번에 여러 data 에 대해 여러 instruction 을 실행하는 것 (Multiple instruction, multiple data).

## Superscalar Processor, ILP

![[Pasted image 20241018120624.png]]

- *Superscalar Processor* 는 이런 superscalar processing 를 지원하는 processor 로, 한번에 여러 instruction 에 대해 [[Instruction Cycle (Arch Instruction)|IF 및 ID]] 를 수행한다.
	- 즉, 여러 instruction 이 issue 된다.
- 이런 superscalar processor 를 활용하여 병렬연산하는 것을 *Instruction Level Parallelism* (*ILP*) 라고 한다.
- 이와 비슷하게, 여러 instruction 을 하나로 묶은 큰 instruction 하나를 issue 해 superscalar 와 같은 느낌을 내게 하는 방법도 있다.
	- 이것을 *Very Long Instruction Word* (*VLIW*) 라고 한다.
	- 옛날에는 intel 과 HP 에서 개발해서 팔아먹었는데 요즘은 안쓴댄다.