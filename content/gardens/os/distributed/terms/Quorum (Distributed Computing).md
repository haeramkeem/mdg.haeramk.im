---
tags:
  - os
  - os-distributed
date: 2024-11-11
aliases:
  - Quorum
  - quorum
  - majority
---
## Quorum

- *Quorum* 은 한국어로는 *정족수* 이며, (나무위키에 따르면) "여러 사람으로 구성된 회의체에서, 안건에 대한 회의를 진행하거나 최종 결정을 내리기 위해 필요한 최소 인원수" 를 의미한다.
- 근데 일반적으로 distributed computing 에서는 "어떤 operation 이 정상적으로 처리되었다고 판단하기 위해 필요한, 해당 operation 을 처리한 replica 의 개수 기준치" 를 의미한다.
- 이때 Replica count 는 $2f + 1$ 개 이고, *Quorum* 은 $f + 1$ 개, 그리고 이때 최대 $f$ 개의 replica failure 를 견딜 수 있다 (fault tolerance) 고들 한다.
- 즉, 아래와 같이 되는데

| DESCRIPTION         | COUNT    |
| ------------------- | -------- |
| Total replica count | $2f + 1$ |
| Quorum              | $f + 1$  |
| Fault tolerance     | $f$      |

- 왜 그런지 생각해 보자

## Majority quorum

- 일단 fault tolerance 개수를 $F$ 라고 하고, Quorum 의 개수는 $Q$, 총 replica 의 개수는 $R$ 이라고 하자.
- 그럼 어떤 operation 이 정상적으로 처리되었다면 $Q$ 만큼의 replica 가 해당 operation 을 처리했다는 소리와 같다.
- 그럼 operation 처리 이후 $Q$ 개 중에서 $F$ 개가 죽어도 1개 이상의 replica 는 해당 operation 을 처리 완료 상태로 갖고 있기 위해서는 $Q - F \ge 1$ 이어야 한다.
	- 따라서 $Q \ge F + 1$ 이므로, 최소 $Q$ 의 수는 $F + 1$ 이다.
- 또한 전체 replica 개수인 $R$ 에서 $F$ 개가 죽어도 정상적으로 작동하기 위해서는, 죽은 이후에도 남은 replica 의 수는 $Q$ 보다는 커야 한다. 즉, $R - F \ge Q$ 이다.
	- $R - F \ge Q \ge F + 1$ 이므로, $R \ge 2F + 1$ 이다. 따라서 최소 $R$ 은 $2F + 1$ 이다.
- 결론적으로 $F = f$ 일 때, Quorum 은 적어도 $Q = f + 1$ 이어야 하고, 총 replica 개수는 적어도 $R = 2f + 1$ 가 되는 것이다.