---
tags:
  - arch
  - terms
aliases:
  - PC
  - IP
  - Instruction Pointer
  - Program Counter
  - Controller Unit
date: 2024-09-10
---
> [!info]- 참고한 것들
> [위키 - Instruction cycle](https://en.wikipedia.org/wiki/Instruction_cycle)
> [[05. Dependences and Pipelining|서울대 이재진 교수님 확장형 고성능 컴퓨팅 강의 (Fall 2024)]]

## 다음에 실행할 instruction 주소

![[Pasted image 20241017210006.png]]

- 이게 전부다. 진짜다.
- *Program Counter* (*PC*) 는 다음에 실행할 [[Instruction (Arch)|Instruction]] 의 주소를 담고 있는 register 로,
- 따라서 항상 instruction 을 실행하기 전에 이놈을 먼저 보고 해당 instruction 을 [[Instruction Cycle (Arch Instruction)|Fetch]] 해온다.
- 보통은 *PC* 라고 많이 부르고, 괴짜스러운 x86 에서는 *Instruction Pointer* (*IP*) 라는 다른 이름을 사용한다.
- 참고로 컴퓨터가 켜질때의 첫 PC 는 predifined 되어 있고, architecture 마다 다르다.
	- 가령 x86 의 경우에는 `0xfffffff0` 라고 한다.
	- 여기에는 OS 를 load 하는 (bootloader?) code 의 시작점이 들어간다고 한다.
- 이 PC 를 바꾸거나 이놈을 보고 instruction 을 fetch 해오는 CPU 의 unit 을 *Controller Unit* (*CU*) 라고 한다.