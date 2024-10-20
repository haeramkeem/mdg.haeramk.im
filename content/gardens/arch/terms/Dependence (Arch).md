---
tags:
  - arch
aliases:
  - Dependence
  - Dependency
date: 2024-10-18
---
> [!info]- 참고한 것들
> - [[05. Dependences and Pipelining|서울대 이재진 교수님 확장형 고성능 컴퓨팅 강의 (Fall 2024)]]

## Ordering Relationship

- Computer architecture 에서, *의존성* (*Dependence*) 는 "연산간의 순서 관계" 를 나타내는 용어이다.
	- Dependence 가 맞는 용어이고, dependency 는 틀린 용어이다.
	- 왜나면 大-이재진 교수님이 틀렸다고 했기 때문.
	- 사실 틀린건 아니다. 교수님만의 convension 임.
- Dependence 가 보존되는 한, 어떻게 실행 순서를 바꿔도 결과는 동일하다.
	- 다만 나중에 배우겠지만, data race 상황에서는 그렇지 않을 수 있다.
- 이놈은 몇가지 종류가 있는데, 이들에 대해서는 다른 작물에서 다뤄보자.
	- [[Data Dependence (Arch)|Data Dependency]]
	- [[Control Dependence (Arch)|Control Dependency]]