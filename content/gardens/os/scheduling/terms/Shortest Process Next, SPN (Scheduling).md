---
tags:
  - mdg
  - os
  - scheduling
  - terms
aliases:
  - Shortest Process Next
  - SPN
  - Shortest Job First
  - SJF
date: 2026-07-16
---
> [!info] 작물 단계: #seed 

> [!info]- 참고한 것들
> - [[10. CPU Scheduling|충남대 류재철 교수님 운영체제및실습 강의 (Spring 2021)]]
> - [[05. CPU Scheduling|이화여자대학교 컴퓨터공학과 반효경 교수님 '운영체제 (KOCW)' 강의]]

## 란?

- Process 종료 후 다음 process 를 선택할 때 실행시간이 가장 짧은놈을 선택하는 방법이다.
- 그래서 *Shortest Job First* (*SJF*) 라고도 부른다.

## 특징

- Process 가 종료되어야 다음 process 를 선택한다. 즉, Non-preemptive 다.
	- 이 알고리즘의 preemptive 버전은 [[Shortest Remaining Time, SRT (Scheduling)|SRT]] 이다.
- 항상 '실행시간이 짧은놈' 을 고르기 때문에, 짧은놈이 계속 들어오면 기존에 있던애들은 굶어죽게된다. 즉, Starvation 이 발생할 수 있다.
- Waiting time 이 가장 짧은 알고리즘으로 알려져 있다고 한다.