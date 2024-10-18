---
tags:
  - arch
  - terms
aliases:
  - Control dependence
  - Basic block
  - Control-flow graph
  - CFG
date: 2024-10-18
---
> [!info]- 참고한 것들
> - [[05. Dependences and Pipelining|서울대 이재진 교수님 확장형 고성능 컴퓨팅 강의 (Fall 2024)]]

## Control dependence

- Control dependence 는 `BRANCH` 에 따라 바뀌는 flow 에 대한 dependence 를 말한다.
- 이것을 분석할 때는 Basic block 과 CFG 를 그려서 생각한다.

### Basic Block

![[Pasted image 20241017200655.png]]

- Basic block 은 첫 [[Instruction (Arch)|Instruction]] 으로 flow 가 들어와서 마지막 instruction 으로 flow 가 나가는 단위를 말한다.
	- 즉, 중간에 `BRANCH` 로 빠져나가거나 다른곳에서부터 `JUMP` 로 들어오는 경우가 없는 코드 단위인 것.
- 구하는 알고리즘은:
	- 첫 instruction 는 "leader" 이다.
	- `JUMP` 의 종착지도 "leader" 이다.
	- `JUMP` 의 다음 instrunction 도 "leader" 이다.
		- `BRANCH` 로 점프하지 않는 경우에는 다음 instruction 이 실행되니까.
	- 이렇게 "leader" 를 구하고 "leader" 부터 다음 "leader" 의 이전까지가 basic block 이다.

### CFG (Control-Flow Graph)

![[Pasted image 20241017200738.png]]

- 각 basic block 들을 flow 에 따라 directed graph 로 표현한 것
- 위 그림이 [[#Basic Block|예시]] 에서의 code 에 대한 CFG 이다.

### 분석하기

- Control dependence 를 분석할 때는 basic block 간의 dependence 를 따진다.
- 가령 basic block A "바로 앞선" basic block B 의 실행 결과에 따라 실행될지 아닐지 결정되는 경우에 A 는 B 에 control dependence 가 있다고 한다.
	- 즉, A 와 B 의 순서가 바뀌면 안되기 때문
- 연속되지 않은 basic block 의 경우에는 다음과 같은 경우에만 control dependence 가 있다고 한다:
	- Basic block A 이후에 B 를 거치는 path 가 존재하고 거치지 않는 path 도 존재할 때