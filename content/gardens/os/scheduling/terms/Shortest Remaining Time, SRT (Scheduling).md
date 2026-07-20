---
tags:
  - mdg
  - os
  - scheduling
  - terms
aliases:
  - Shortest Remaining Time
  - SRT
date: 2026-07-16
---
> [!info] 작물 단계: #seed 

> [!info]- 참고한 것들
> - [[10. CPU Scheduling|충남대 류재철 교수님 운영체제및실습 강의 (Spring 2021)]]
> - [[05. CPU Scheduling|이화여자대학교 컴퓨터공학과 반효경 교수님 '운영체제 (KOCW)' 강의]]

## 란?

- [[Shortest Process Next, SPN (Scheduling)|SPN]] 이랑 비슷한데, 이놈은 preempt 를 한다.
- Process 가 하나 들어오면 그놈의 실행시간과 현재 실행되는놈의 남은시간을 비교해 더 짧은것을 실행시킨다.

## 특징

- 우선 이놈은 preemptive 이다. 즉, 실행시간이 짧은놈이 들어오면 기존의 것을 뺏을 수 있다.
- 나머지 특징은 [[Shortest Process Next, SPN (Scheduling)|SPN]] 과 거의 비슷하다.
	- 항상 '실행시간이 짧은놈' 을 고르기 때문에, 짧은놈이 계속 들어오면 기존에 있던애들은 굶어죽게된다. 즉, Starvation 이 발생할 수 있다.
	- Waiting time 이 가장 짧은 알고리즘으로 알려져 있다고 한다.