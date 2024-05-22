---
tags:
  - OS
  - Memory
  - 용어집
date: 2024-05-22
---
> [!info]- 참고한 것들
> - [[09. Segmentation#Replacement Policy|충남대 류재철 교수님 운영체제 강의 (Spring 2021)]]
> - [[09. Virtual Memory#LRU, LFU Algorithm|이화여대 반효경 교수님 운영체제 강의 (KOCW)]]

## 덜 최신에 사용된

- 즉, 가장 오래전에 사용된
- ...놈을 cache 나 memory 에서 내쫒는 [[Cache Replacement Policy (memory)|Cache replacement policy]] 이다.
- 최근에 참조된 놈은 조만간 다시 참조될 것이라는 [[Temporal Locality (memory)|시간 지역성]] 에 기반한 것이다.
	- 유사하지만 비슷한 놈으로는 [[Least Frequently Used, LFU (memory)|LFU]] 가 있다.
- [[First In First Out, FIFO(memory)|FIFO]] 와 비슷하다고 생각할 수 있지만 좀 다르다.
	- FIFO 는 가장 오래전에 "cache 에 올라온" 놈을 지우는거고
	- LRU 는 가장 오래전에 "참조된" 놈을 지우는거다.
- Linked List 형태로 구현한다
	- 즉, 참조되면 그놈을 제일 아래로 내려 제일 높은 우선순위를 갖게 하고
	- 내쫒을때는 제일 위에 있는 제일 낮은 우선순위를 내쫒음
	- 따라서 시간복잡도는 O(1) 이 됨
- "최근" 만 고려하기 때문에 LFU 에서의 "빈도" 에 대한 고려는 하지 못한다는 단점이 있다.