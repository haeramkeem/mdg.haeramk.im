---
tags:
  - database
  - db-concurrency
date: 2025-05-05
title: (논문 요약) A Scalable Lock Manager for Multicores (SIGMOD'13)
---
> [!info] 원본 논문
> - 이 글은 [A Scalable Lock Manager for Multicores (SIGMOD'13)](https://dl.acm.org/doi/pdf/10.1145/2463676.2465271) 논문을 읽고 정리한 글입니다.
> - 별도의 명시가 없으면, 본 논문에서 그림을 가져왔습니다.

## Motivation

![[Pasted image 20250505194216.png]]

- 위 그림은 *Multi-Programming Level* (*MPL*) 이 높아졌을 때, CPU core 개수에 대해 throughput 을 보여주는 그림이다.
- 보면 갈색이 1 core, 초록색이 4 core 인데 이때까지는 같은 socket 내의 core 라서 그나마 성능 방어가 잘 되는데
- 노란색인 8 core 부터는 같은 socket 이라도 성능이 좀 꺾이기 시작하더니 다른 socket 의 core 도 사용하는 16, 32 core 의 경우에는 성능이 바닥을 친다.

![[Pasted image 20250505194636.png]]

- 이것의 원인을 알기 위해 profile 을 해보면, kernel 과 mutex 가 차지하고 있는 것을 알 수 있다.
	- 이것 둘다 [[Spin Lock (Process)|Spin lock]] 와 연관이 있는데, spin lock 에서 cache invalid message 가 socket 간에 계속 왔다갔다 하기 때문이다.
- 그리고 더 파보니 lock manager 의 operation 을 통째로 막아버리는 giant latch 이 문제임을 알아냈고, 본 논문은 이 latch 를 없애 성능 향상을 기하는 것이 목표이다.
	- 왜냐면 원래 spin lock 이라는 것은 busy-wait 하기 때문에 짧은 기간동안 critical section 을 보호하는 것이 능한데, lock manager 의 giant latch 로 이것을 막아버리면 latch 가 잡혀있는 기간이 길기 때문에 그에 따라 cache invalidation 도 많아지는 것이다.

## Key Idea

- Lock table 은 linked-list 를 element 로 하는 hash table 이다. 따라서 이 각각의 linked-list 에 대해서 latch 없이 정확하게 작동하면 될 것이다.
- Latch 를 제거하는데 핵심 아이디어 두개는 *RAW* 와 *Staged de-allocate* 이다.

### Read After Write, RAW

- 우선 여기서 *Read After Write* 라는 것은 shared variable 하나를 write 한 다음, 다른 shared variable 하나를 read 하는 것이라고 생각하면 된다.
- 이때 조심할 것은 이렇게 되면 이 두 write 와 read 간에는 [[Data Dependence (Arch)|RAW dependence]] 가 없기 때문에 compiler 혹은 [[Instruction Level Parallelism (Arch)|Superscalar]] 에서는 이놈의 순서를 바꿔서 실행할 수 있다.
- 하지만 이러면 문제가 생긴다. 아래 그림에서 (a) 를 보자.

![[Pasted image 20250505204426.png]]

- $P$ 는 A 를 write 하고 ($P:A=1$), B 를 read 한다 ($P:B=?$). 그리고 $Q$ 는 반대로 B 를 write 하고 ($Q:B=1$), A 를 읽는다 ($Q:A=?$).
- 그럼 일반적으로는 다음과 같은 경우의 수를 생각할 수 있다.
	- (1) $P:A=1$ (2) $Q:B=1$ (3) $P:B=?$ (4) $Q:A=?$ 라면, (3) 에서 $P$ 는 $B=1$ 를 읽게 되고, (4) 에서 $Q$ 는 $A=1$ 를 읽게 된다.
	- (1) $P:A=1$ (2) $P:B=?$ (3) $Q:B=1$ (4) $Q:A=?$ 라면, (2) 에서 $P$ 는 $B=0$ 를 읽게 되고, (4) 에서 $Q$ 는 $A=1$ 를 읽게 된다.
	- (1) $Q:B=1$ (2) $Q:A=?$ (3) $P:A=1$ (4) $P:B=?$ 라면, (2) 에서 $Q$ 는 $A=0$ 를 읽게 되고, (4) 에서 $P$ 는 $B=1$ 를 읽게 된다.
- 즉, 위의 세 가지 경우의 수에서 $P$ 와 $Q$ 둘 중 하나는 자기가 읽은 값이 1이다.
- 하지만 dependence 가 없어서 코드를 바꿔버리면 문제가 생긴다.
	- 가령 (1) $P:B=?$ (2) $Q:A=?$ (3) $P:A=1$ (4) $Q:B=1$ 이면 (1) 와 (2) 에서 $P$ 와 $Q$ 는 모두 0 을 읽는다.
- 이 문제는 P 혹은 Q 각각을 spinlock 을 이용해 critical section 으로 묶어버리면 해결된다.
- 하지만, 그림 (b) 처럼 barrier 를 사용해도 이것은 동일하게 해결될 수 있다.

### Staged De-allocation

> [!tip] 생략된 설명
> - 논문에서는 Staged allocation 도 있지만, 이건 생략

- Linked-list 에서 node 를 빼는 것은 순간적으로 linked list 의 "연결되어 있어야 한다" 라는 invariant 를 깨트린다.
- 따라서 본 논문에서 선택한 방법은 node 를 빼지 않고 logical delete 하는 것이다.
- 즉, node 의 상태를 `OBSOLETE` 로 만들고, 나중에 이놈을 지우자는 것.
- 구체적으로는 다음과 같다. Lock table 에 접근할 때마다 부여받는 timestamp 가 하나 있다고 했을 때,
	- 어떤 node 가 $T_0$ 에 `OBSOLETE` 가 됐다고 해보자.
	- 그 이후, 누군가가 $T_1$ 에 이 node 를 linked list 에서 뺴서 GC queue 에다가 넣는다. 그럼, 이 시점을 기준으로 추가적으로 이 node 를 볼 수 있는 놈은 없다.
	- 하지만, 이미 이놈을 보고 있는 놈이 있을 수 있기 때문에 background GC worker 가 주기적으로 다음과 같은 검사를 한다.
		- 이 background GC worker 는 지금 lock table 에 접근한 thread 가 누가 있나 확인하고, 이들 중에서 부여받은 timestamp 의 최소값 ($T_2$) 을 구한다.
		- 만약 $T_0 < T_1 < T_2$ 라면, 이 node 를 지운다. 왜냐면 살아있는 timestamp 의 최소값이 $T_1$ 보다 크기 때문에 이 node 를 볼 수 있는 놈은 아무도 없기 때문이다.

## Lock Table Implementation

### Lock acquire

- 위와 같은 아이디어를 기반으로, [[Two Phase Locking, 2PL (Database Transaction)|2PL]] 에서 lock acquire 은 다음과 같이 구현된다.
- 코드 자체는 별거 없다. linked list 에 insert 하고, 내가 head 가 아니면 wait 상태로 가며, deadlock checking 을 해서 deadlock 이 걸리면 abort 한다.

![[Pasted image 20250505211708.png]]

- 근데 왼쪽의 MySQL 와의 차이점이라고 한다면, mutex 가 없어지고 대신 매번 node 의 state 가 바뀔 때 마다 barrier 를 쳐놓는다.
	- 즉, spinlock 대신 위의 RAW pattern 을 사용하는 것.
- 그리고 저기 `atomic_lock_insert()` 에서는 다음과 같은 짓을 한다.

![[Pasted image 20250505212141.png]]

- 여기도 별건 없다. (1) [[Test and Set, TAS (C Atomic)|TAS]] 로 tail 을 바꿔주고, (2) 기존의 tail 이었던 놈의 next 를 바꿔주며, (3) [[#Staged De-allocation]] 에서 말한 것 처럼 몇몇 `OBSOLETE` node 들의 pointer 들을 바꿔준다.
- 근데 [[Mellor-Crummey and Scott Lock, MCS Lock (Lock Data Structure)|MCS Lock]] 에서처럼, 이렇게 하면 저 (1) 와 (2) 사이에서 invariant 가 깨질 수 있다.
- 따라서 node iteration 은 아래와 같이 수행된다.

![[Pasted image 20250505212210.png]]

- 보면 현재의 lock 의 next 가 NULL 이고 lock 이 tail 이 아닐 때 barrier loop 을 돈다.
- 즉, (1) 와 (2) 가 atomic 하게 실행되지 않기 때문에, 여기서 barrier loop 을 돌면서 (2) 가 끝날 때 까지 기다리고, 이놈이 끝난 뒤에야 다음 node 로 iterate 하는 것이다.

### Lock release

![[Pasted image 20250505211731.png]]

- Lock release 도 별거는 없다.
	- Lock 의 상태를 `OBSOLETE` 로 만들고 ([[#Staged De-allocation]]),
	- 상태가 바뀔 때 마다 barrier 를 걸어서 [[#Read After Write, RAW]] pattern 으로 실행되도록 해 spinlock 의 필요성을 없앤다.