---
tags:
  - OS
  - SNU_CSE_MS_AOS24S
  - 논문
date: 2024-05-22
---
> [!info] 본 글은 Nimrod Megiddo 의 논문 [ARC: A Self-Tuning, Low Overhead Replacement Cache (FAST'03)](https://www.usenix.org/conference/fast-03/arc-self-tuning-low-overhead-replacement-cache) 를 읽고 정리한 글입니다.

> [!info] 별도의 명시가 없는 한, 본 글의 모든 그림은 위 논문에서 가져왔습니다.

> [!fail] 본 문서는 아직 #draft 상태입니다. 읽을 때 주의해 주세요.

## 1. Abstract & Introduction

### A. The problem

#### Background: de-facto standards

- De-facto 가 된 아키텍처는 다음과 같은 키워드로 정리할 수 있다. 이미 다른 문서에서도 여러번 등장했을 테니 간단하게 정리만 해보자.
- [[Memory Hierarchy (Memory)|Memory hierarchy]]:
	- 저장 공간은 속도와 크기 간의 trade-off 가 있다.
	- 즉, 속도가 빠르면 그만큼 비싸고, 따라서 크기를 줄일 수 밖에 없는 것.
	- 이러한 상황 속에서, 거의 모든 modern computer 는 한 종류의 저장공간만을 사용하는 것이 아닌 빠르되 크기는 작은 저장장치 (즉, 레지스터 같은) 를 상위계층에 두고 느리지만 크기가 큰 저장장치 (즉, 하드디스크같은) 를 하위계층에 두는 등 계층적으로 전체적인 저장공간을 구성하게 된다.
	- 여기서 계층이 높다는 것은 CPU 와의 거리라고 생각하면 되니라
- [[Paging (Memory)|Uniform page]]:
	- 가변 사이즈 정책을 사용하고 [[External Fragment (OS)|External fragment]] 를 유발하는 segment 와 고정 사이즈 정책을 사용하고 [[Internal Fragment (OS)|internal fragment]] 를 유발하는 page 간의 경쟁에서 이긴 것은 page 이다.
	- 왜 segment 가 아닌 page 기법이 채택되었는지는 본 논문에서도 언급되지 않고 나중에 다른 문서에서 따로 한번 정리를 할 것이기에 여기서는 패스
- [[Demand Paging (Memory)|Demand paging]]:
	- Demand paging 은 "page 가 요청되는 시점에, 이미 올라와있지 않은 놈만 상위계층으로 올리는 것" 이다.
	- 그리고 보통 하나의 page 만 올리는 것이 아닌 "빠른 시일 내로 요청될 것 같은 여러 page" 들을 같이 올리게 된다 (이것이 prefetching 이다.)
	- 따라서 저장장치의 여유공간이 빠르게 없어지게 되는데, 공간이 부족한 경우에 새로운 page 를 올리기 위해서는 어떤 page 는 하위계층으로 쫒겨나야 한다.
	- 이때 어떤 page 를 내릴 것인지 결정하는 것이 [[Replacement Policy (replacement policy)|cache replacement policy]] 이다.

#### Metrics for cache replacement policy

- 위와 같은 de-facto 내에서, cache replacement policy 를 개선하는 것은 운영체제부터 사용자 애플리케이션까지 모든 관점에서 성능 향상을 가져온다.
- 따라서 여러 cache replacement policy 는 오랜 기간동안 이목을 받아 왔는데, 이놈의 성능을 측정하기 위한 metric 은 다음과 같은 것이 있다.
- Hit, miss rate:
	- 원하는 page 가 이미 상위 계층으로 올라와있는 상황에 대한 빈도가 hit rate 이고,
	- 반대로 올라와있지 않아 올려야 하는 상황에 대한 빈도가 miss rate 이다.
	- 이들은 여집합의 관계가 있으니까 아마 더하면 1 이 되겠지?
- Overhead:
	- 여기에서 overhead 라는 것은 이 cache replacement policy algorithm 에 대한 시공간 복잡도를 의미한다.
	- 즉, 이 cache replacement policy 를 사용하는데에만 너무 많은 연산이 필요하거나 너무 많은 메모리를 잡아먹게 된다면 무의미하다는 것.
	- 대표적으로는 [[Least Recently Used, LRU (replacement policy)|LRU]] 와 [[Least Frequently Used, LFU (replacement policy)|LFU]] 간의 차이가 있다.
		- LRU 의 경우에는 단순히 Linked-list 로 구현할 수 있어 $O(1)$ 의 시간복잡도를 가지지만,
		- LFU 의 경우에는 정렬을 해야 하기에 Heap 이 필요해 $O(logn)$ 의 시간복잡도를 가지기에 overhead 가 큰 셈.
- 따라서 "좋은 cache replacement policy" 라는 것은 hit rate 가 높고, overhead 가 적은 것일 것이다.

### B. Our contributions

#### Key idea

- 본 논문에서 제시하는 ARC 알고리즘은 위에서 말한 metric 에 대해 다음과 같은 입장을 가진다:
	- High hit rate: hit rate 는 극대화
	- Conscientious overhead: overhead 는 적당히
		- 즉, 어느정도의 overhead 는 감수하겠다는 것.
- 그리고 가장 핵심적인 아이디어는 Adaptive (ARC 의 A 이다!) 이다.
	- 즉, 모든 상황에 들어맞는 하나의 알고리즘은 없다는 것 (one-size-fits-all 따위는 없다).
	- 특정 page 만 반복적으로 접근하는 상황부터, 넓게 산재되어있는 page 들을 접근하는 상황까지 아주 다양한 상황들이 펼쳐질 수 있고, 이 각각에 대해 하나의 알고리즘으로 해결하지는 못한다는 것이다.

#### Adaptivity details

- 이제 이 ARC 에서 핵심이 되는 Adaptivity 가 구체적으로 어떤 의미인지 알아보자.
- 구현에는 LRU 에 따라 page 가 방출되는 (즉, 제일 옛날에 참조된 놈이 방출되는) 리스트 두개가 필요하다.
	- $L_1$: "최근에", "단 한번만" 접근된 page
	- $L_2$: "최근에", "두번 이상" 접근된 page
	- 느낌이 $L_1$ 에 있다가 한번 더 참조되면 $L_2$ 로 옮겨지는 식으로 구현될 것 같죠?
	- $L_1$ 은 따라서 *recency*, 즉 [[Temporal Locality (replacement policy)|시간 지역성]] 의 공간이고 $L_2$ 는 *frequency*, 즉 [[Spacial Locality (replacement policy)|공간 지역성]] 의 공간이다.
- 그리고 각각의 용량은 cache size 인 $c$ 이다.
	- "용량" 이다; 이것은 C++ vector 에서의 capacity 와 유사하다고 생각하면 되고 [^lru-capacity],
	- 뒤에서 나올 "사이즈" 는 C++ vector 에서의 size 라고 생각하면 된다.
- 이 두 리스트는 묶어서 *cache directory* 라고도 부른다.
	- 즉, *cache directory* 의 용량은 정확히 $2 * c$ 인 것.
- 그리고 여기서 $p$ 라는 값이 등장한다.
	- 이 $p$ 는 가변적인 값으로, $L_1$ 의 사이즈가 $p$ 일 때, $L_2$ 의 사이즈는 $c - p$ 가 되어 $L_1$ 와 $L_2$ 의 사이즈 합은 언제나 $c$ 가 된다.
- 이 지점에서 저 "*Adaptively* (*dynamically*)" 라는 용어가 왜 나왔는지 알게 된다.
	- ARC 는 이 *recency* 와 *frequency* 를 상황에 따라 다른 비중으로 활용하여 캐싱하는 알고리즘인 것.
	- 이 두 리스트에 담긴 page 들이 실제 cache 에도 들어가기 때문에, 한 시점에서 cache 에는 $p$ 개의 "최근에 참조된" page 와, $c - p$ 개의 "빈번하게 참조된" page 들이 공존하게 되는 것.
		- 이것은 [[09. Virtual Memory#LRU vs LFU|여기]] 에도 언급했던 LRU 와 LFU 간의 장단점을 보완하는 것이기도 하다.
	- 따라서 시간 지역성이 중요해지는 순간에는 $L_1$ 사이즈를 늘리고, 공간 지역성이 중요해지는 순간에는 $L_2$ 사이즈를 늘리게 되는 것.
- 그럼 이 p 라는 값을 어떻게 정할 것인가가 중요한 화두가 될 것이다.
	- 일단 introduction 에서는 이 과정은 자세히 말해주지 않는다.
	- 그냥 "random walk" 라는 방법으로 과거의 기록을 활용하는 "learning rule" 을 사용한다고 하네
	- 이걸 통해서 실시간으로 (*on-line*, *on-the-fly*, *continually*) $p$ 값을 조정한다고 한다.

#### Summary of evaluation

> [!fail] #draft 이후 내용은 나중에 정리하겠슴다..

## 2. Prior work: A brief review

### A. Offline Optimal

### B. Recency

[^lru-capacity]: 사실 이부분은 주인장의 주관적인 해석이다. 뒤에 읽다 보면 알겠지 뭐