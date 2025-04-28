---
tags:
  - arch
  - arch-inst
aliases:
  - Data Forwarding
  - Data forwarding
date: 2025-04-27
---
> [!warning] #draft 본 글은 토막글 상태입니다.
> - [ ] 내용 추가

> [!info]- 참고한 것들
> - [[02. Instruction Level Parallelism|서울대 유승주 교수님 고급 컴퓨터 구조 강의 (Spring 2025)]]

## TL;DR

- *Data Forwarding* 은 [[Instruction Pipeline (Arch Instruction)|CPU Pipeline]] 에서, [[Data Dependence (Arch)|RAW dependence]] 가 있을 경우 기존에는 [[Instruction Cycle (Arch Instruction)|WB]] 을 한 뒤에야 다른 instruction 이 읽어갈 수 있었던 것을, [[Instruction Cycle (Arch Instruction)|EX]] 이 끝나자마자 바로 읽어갈 수 있게 하여 [[Pipeline Hazard (Arch)|Stall]] cycle 을 줄이는 방법이다.