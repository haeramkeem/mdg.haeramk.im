---
tags:
  - arch
  - arch-cpu
aliases:
  - Branch Prediction
  - Branch prediction
  - Branch Misprediction
  - Branch misprediction
date: 2025-04-28
---
> [!warning] #draft 본 글은 토막글 상태입니다.
> - [ ] 내용 추가

## Branch Prediction

- *Branch prediction* 이라는 것은, [[Instruction Pipeline (Arch Instruction)|Pipeline]] 으로 instruction 을 실행하는 환경에서 branch instruction 이 있으면 다음에 어떤 instruction 을 실행해야 할 지 알 수 없기 때문에, 미리 예측하여 실행하는 것이다.
	- 이러한 관점에서, branch prediction 을 HW-based speculative execution 이라고 하기도 한다.
	- [[Control Hazard (Arch)|Control hazard]]