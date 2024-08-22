---
tags:
  - 용어집
  - os
  - memory
date: 2024-05-26
---
> [!info]- 참고한 것들
> - [[09. Segmentation#Replacement Policy|충남대 류재철 교수님 운영체제 강의 (Spring 2021)]]
> - [[09. Virtual Memory#LRU, LFU Algorithm|이화여대 반효경 교수님 운영체제 강의 (KOCW)]]

## 덜 빈번하게 사용된

- 가장 사용 빈도가 낮은 놈을 방출시키는 [[Replacement Policy (replacement policy)|cache replacement policy]] 이다.
- 자주 사용된 놈은 또 사용될 것이라는 [[Spacial Locality (replacement policy)|공간 지역성]] 에 기반한 방법인 셈.
- Heap 을 이용하여 구현한다
    - 참조 시점이 아니라 빈도가 중요하므로 다른 놈들과의 비교를 해야되는데
    - 비교할때는 Linked List 를 이용해 일렬로 비교하며 따라가는 것 보다는 Heap 을 이용해 Leaf 까지 따라가며 비교횟수를 줄이는 것이 좋기 때문
    - 따라서 [[Least Recently Used, LRU (replacement policy)|LRU]] 에 비해서는 실제 작동시에 시간복잡도가 떨어진다.
- 단순히 빈도만을 고려하기에 LRU 와 같은 "최근" 에 대한 고려는 하지 못한다는 단점이 있다.
	- 즉, 최근에 처음으로 접근한 놈은 제일 적게 접근한 놈이 되기에 방출되어 이후의 연속된 접근에서 계속 fault 가 발생하는 문제가 생길 수 있다.