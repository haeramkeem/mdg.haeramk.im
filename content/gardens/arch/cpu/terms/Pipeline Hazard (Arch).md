---
tags:
  - arch
  - arch-inst
aliases:
  - Pipeline hazard
  - Hazard
  - Bubble
  - Stall
date: 2025-04-27
---
> [!info]- 참고한 것들
> - [[05. Dependences and Pipelining|서울대 이재진 교수님 확장형 고성능 컴퓨팅 강의 (Fall 2024)]]

> [!warning]- #draft 본 글은 토막글 상태입니다.
> - [ ] 내용 추가

## Hazard

- Hazard 의 사전적인 뜻은 "위험을 초래할 수 있는 잠재적 요소 (potential source of harm)" 을 의미한다.
- 컴퓨터 구조에서 *Pipeline Hazard* 혹은 *Hazard* 라는 것은
	- (1) 위험을 초래할 수 있어
	- (2) 현재 [[Instruction Cycle (Arch Instruction)|EX]] stage 에 있는 instruction 의 다음 instruction 이 다음 clock cycle 에서 EX 단계에 진입하지 못하고
	- (3) 잠시 멈춰야 하는 (*Stalling*) 경우를 말한다.
		- 그리고 이 멈춘 cycle 을 *Bubble* 이라고도 한다.
- 여기에는 크게 다음의 두 가지가 있다:
	- [[Data Hazard (Arch)|Data hazard]]
	- [[Structure Hazard (Arch)|Structural hazard]]