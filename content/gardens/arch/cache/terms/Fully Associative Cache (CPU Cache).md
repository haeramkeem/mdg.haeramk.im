---
tags:
  - arch
  - arch-cache
date: 2024-10-09
aliases:
  - Fully associative cache
---
> [!info]- 참고한 것들
> - [[10. Caches|서울대 이재진 교수님 확장형 고성능 컴퓨팅 강의 (Fall 2024)]]

## Fully Associative Cache

![[Pasted image 20241203192713.png]]

- Direct-mapped cache 는 간단하긴 하지만 cache miss 가 너무 많이 난다.
	- Tag 가 다르면 그냥 숙청되기 때문.
- 그럼 반대로, set 을 1개만 사용하면 어떻게 될까. 이것이 *Fully-associative cache* 이다.
- 이때는 cache miss 시에 그냥 set 의 빈자리에 cacheline 을 밀어넣는다.
- "빈자리" 에 넣는다는 것이 중요하다.
	- 덕분에 cache evict 가 많이 줄어들게 된다. Direct-mapped cache 의 경우에는 cache 가 많이 비어있어도 정작 내가 들어가야 하는 set 이 차있으면 evict 시켜야 하기 때문.
	- 따라서 evict 가 발생하는 것은 진짜 cache 가 전부 차있을때 이므로 그만큼 utilization 이 좋다고 할 수 있다.
- 하지만 당연히 단점이 있는데, 그것은 복잡해진다는 것이다.
	- 모든 cacheline 의 tag 를 비교해야 하고, 이것을 linear 하게 하는 것은 불가능하기 때문에 (SW 가 아닌 HW 이므로) 한번에 tag 를 비교하기 위해 위처럼 복잡한 회로가 추가된다.
	- 그리고 evict 시에 victim 을 선정할 필요도 생긴다. 이를 위해 replacement 를 위한 회로도 추가된다.