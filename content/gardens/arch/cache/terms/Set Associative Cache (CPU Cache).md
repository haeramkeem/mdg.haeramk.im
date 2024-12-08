---
tags:
  - arch
  - arch-cache
date: 2024-10-09
aliases:
  - Set associative cache
---
> [!info]- 참고한 것들
> - [[10. Caches|서울대 이재진 교수님 확장형 고성능 컴퓨팅 강의 (Fall 2024)]]

## Set Associative Cache

![[Pasted image 20241203193816.png]]

- CS 에서는 항상 trade-off 가 있으면 그 중간놈도 존재하는 법이다.
- Direct-mapped cache 는 간단하지만 miss 가 자주 일어나는 문제가 있었고, Fully-associative cache 는 그 반대였기 때문에, 그 중간지점인 적절한 개수의 set 과 적절한 개수의 line 을 사용하는 놈을 생각하게 되는 것.
- 이것이 *Set Associative Cache* 이다.
- 위 그림을 보면, 좀 복잡해 보이긴 하지만 cacheline 두개가 연달아 붙어있는 형태이다.
	- 일단 set index 로 해당 set 으로 찾아가면, 여기에는 cacheline 이 두개가 있다.
	- 이 두 cacheline 에 대해, tag 를 한번에 비교하고 맞는놈에 대한 cacheline 에서 offset 으로 가져오게 되는 것.
- 여기서 set 하나에 몇개의 line 을 둘 것이냐에 따라 *N-way* 라고 부른다.
	- 2개 있으면 2-way, 4개면 4-way 등등