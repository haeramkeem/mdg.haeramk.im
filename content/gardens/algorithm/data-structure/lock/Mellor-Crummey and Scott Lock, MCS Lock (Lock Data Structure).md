---
tags:
  - terms
  - data-structure
date: 2025-05-05
aliases:
  - Mellor-Crummey and Scott Lock
  - MCS Lock
---
> [!info]- 참고한 것들
> - [[03. Spin Locks and Contention|서울대 정형수 교수님 빅데이터 및 지식 관리 시스템 2 강의 (Spring 2025)]]

## MCS Lock

- 지금 linux 에서 사용되는 locking 방식 ([qspinlock.c](https://github.com/torvalds/linux/blob/master/kernel/locking/qspinlock.c) 에 있댄다).
- [[Craig, Landin, and Hagersten Lock, CLH Lock (Lock Data Structure)|CLH lock]] 에서는 uncached [[Non-Uniform Memory Access, NUMA (Arch)|NUMA]] 에서 문제가 있었고, 이것을 해결하기 위해 나온 것이다.
	- CLH lock 에서는 spinning 할 qnode 를 다른놈이 만들어 주었기 때문에 qnode 가 remote NUMA memory 에 있게 되면 이 remote 에 계속 접근하며 spinning 을 해야 되기 때문에 비효율적이다.
	- 따라서 MCS lock 에서는 local 에서 spinning 을 하기 위해 내가 만든 qnode 에서 spinning 을 하고, 다른 thread 가 여기에 와서 나를 깨워주는 방식으로 바꾸는 것이 핵심이다.

### Acquire

![[Pasted image 20250505172307.png]]

- 위 그림에서 저 빨간놈이 lock acquire 를 하려고 한다고 해보자.
- 그럼 일단 CLH 에서와 마찬가지로 qnode 를 하나 생성하고 (빨간색 qnode), tail 에 대해 [[Test and Set, TAS|TAS]] 를 해서 다음과 같은 상태로 만든다.

![[Pasted image 20250505172516.png]]

- 그럼 이제 빨간색은 자기가 만든 빨간색 qnode 에서 spin 을 하고 싶을 텐데, 그러기 위해서는 저 보라색이 어떤 qnode 에 접근해야 하는지를 빨간색이 말해줘야 한다.
- 따라서 아래 그림처럼 빨간색은 TAS 로 받은 보라색 qnode 의 next 에다가 자기가 만든 빨간색 qnode 를 연결해서 보라색이 와서 나를 깨워줄 수 있게 한다.

![[Pasted image 20250505172805.png]]

- 즉, CLH lock 에서는 linked list 가 간접적으로 연결되어 있는 *Implicit linking* 이었다면, MCS lock 에서는 직접적으로 연결된 *Explicit lock* 의 형태가 되는 것이다.

### Release

- 그럼 보라색은 자기가 lock release 를 할 때는, 다음처럼 자기가 만든 보라색 qnode 의 next 를 타고 와서 `TRUE` 를 `FALSE` 로 바꿔 빨간색을 깨워준다.

![[Pasted image 20250505172948.png]]

- 근데 이때 하나의 함정이 있다. 보면 빨간색이 해야 하는 일은 두 가지이다.
	1) 우선 TAS 를 해서 자신이 만든 빨간 qnode 를 tail 에 연결해야 한다.
	2) 그리고 TAS 로 받아온 qnode (보라) 의 next 에 자신의 qnode (빨강) 을 연결해야 한다.

![[Pasted image 20250505173850.png]]

- 하지만 이 두 과정 중간에, 위 그림처럼 보라색이 release 를 하려고 한다면 문제가 생긴다.
	- (1) 이 끝난 다음 아직 (2) 를 하지 못한 상태라면, 보라색이 release 를 하려고 할 때 자신의 qnode 의 next 가 NULL 이기 때문에 이 뒤에 아무도 없구나 라고 판단할 것이다.
	- 하지만 실제로는 뒤에 빨간색이 기다리고 있기 때문에, 뒤늦게 빨간색이 (2) 를 하고 spin 을 해봤자 아무도 자신을 깨워주지 않기 때문에 무한루프에 빠진다.
- 즉, linked list 의 node 들이 "연결" 되어 있어야 한다는 representation invariant 가 깨지게 된다.
- 이것을 해결하는 방법은 여러가지가 될 수 있는데, 대표적으로는 다음과 같이 해결한다.
	- 우선 보라색은 자신의 qnode 의 next 를 보고 NULL 인지 확인한다. 만약에 NULL 이 아니라면, 그놈으로 가서 깨워주고 return 한다.
	- 근데 만약 NULL 일 경우에는, 위의 경우처럼 가짜 NULL 인지 파악해야 한다. 그래서 tail 에 대해 [[Compare and Swap, CAS|CAS]] 를 때려서, 만약 tail 이 NULL 이면 NULL 을 overwrite 하고 NULL 이 아니면 swap 하지 않고 tail 의 값을 받아온다.
	- 그리고 만약 받아온 값이 tail 의 값이라면 (즉, NULL 이 아니라면) 뒤에 기다리고 있는 놈이 있는데 아직 next 를 설정하지 않았다는 의미이므로 waiting 을 하게 된다.
		- 그래서 이 waiting 을 하는 동안 release 하는 놈이 delay 되므로, 이것이 MCS 의 drawback 이 된다.