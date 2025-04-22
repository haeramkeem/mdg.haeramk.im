---
tags:
  - storage
  - terms
date: 2025-01-20
aliases:
  - Little's Law
---
> [!info]- 참고한 것들
> - [위키](https://en.wikipedia.org/wiki/Little%27s_law)
> - [티스토리](https://performance.tistory.com/3)

## 난쟁이가 쏘아올린 작은 법칙

- 이건 *John Little* 이라는 사람이 만든 queueing theory 이다.
- 가령 다음의 예시를 생각해 보자.

> [[index|주인장 김씨]] 가 용산구 윤씨의 재판 과정을 보기 위해 헌법재판소에 방문했다고 해보자.
> 근데 사람이 너무나 많은 것이었다! 김씨가 세어보니 2시간동안 200명이 헌법재판소에 방문해서 줄을 섰고, 한 사람당 대기 시간은 평균 30분이었다.
> 이때, 대기줄의 평균 길이는 얼마일까?

- 생각해 보면
	- 대기줄의 길이가 평균 1이었다고 가정해 보자. 그럼 한 사람당 대기시간의 평균은 30분 (0.5시간) 이기 때문에 100명이 대기하려면 50시간이 걸렸을 것이다.
	- 이번에는 대기줄의 길이가 평균 2였다고 가정해 보자. 그럼 두사람이 30분을 대기하고 입장할 것이기 때문에 100명이 대기하고 들어가기까지는 25시간이 걸릴 것이다.
	- 근데 실제로는 100명이 대기하는데에는 1시간이 걸렸으므로 (2시간동안 200명이므로) 대기줄의 길이는 평균 50인 것을 알 수 있다.
- 즉, 이것은 바꾸어 말하면 (시간당 방문자 수) $\times$ (대기시간의 평균) = (대기열의 평균 길이) 가 된다는 것을 알 수 있다.
	- 위의 예시에서 (시간당 방문자 수) 는 100명이고,
	- (대기시간의 평균) 은 0.5 시간이었으므로
	- 이 둘을 곱한 50명이 (대기열의 평균 길이) 가 되는 것이다.
- 이것을 수식으로 표현해 보면 다음과 같다.
	- (시간당 방문자 수) 를 $\lambda$ 라고 하고,
	- (대기시간의 평균) 을 $W$ 라고 하며
	- (대기열의 평균 길이) 를 $L$ 라고 하면

$$
L = \lambda \times W
$$

- 가 된다.
- 이것을 Queueing theory 에도 적용할 수가 있다.
- 가령 네트워크 패킷을 처리하는 NIC 의 queue 의 경우에 이 법칙을 적용해 보자.
	- 그럼 $L$ 은 queue 의 평균 occupancy 가 될 것이고
	- $\lambda$ 는 패킷 수신 속도가 되며 (단위시간당 수신된 패킷의 양)
	- $W$ 은 queue 에 머무른 시간이 된다.
		- 만약에 packet 을 처리한 뒤에 queue 에서 해당 request 를 삭제한다면, 이 값은 *Response time* 이 된다.
		- 또한 이것은 *Latency* 로도 생각할 수 있다.

## 활용

- 이 수식을 활용해 latency 를 계산할 수도 있다. [[Tiered Memory Management - Access Latency is the Key! (SOSP'24)|Colloid]] 에서의 용례를 그대로 가져와 보면,
- [[Caching Home Agent, CHA (Intel Cache Arch)|CHA]] 에서 제공하는 memory request 의 occupancy ($O$) 와 arrival rate ($R$) 를 위의 수식에 넣으면 memory request latency ($D$) 를 구할 수 있다.
- Occupancy 는 Little's law 에서 $L$ 에 해당하고, arrival rate 은 $\lambda$ 에 해당하며 latency 는 $W$ 에 해당한다.
- 따라서 위의 수식에 따라 latency ($D$) 는:

$$
D = {O \over R}
$$

- 이 된다.