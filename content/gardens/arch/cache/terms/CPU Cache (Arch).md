---
tags:
  - arch
  - arch-cache
date: 2024-10-09
aliases:
  - Cache
  - Cache line
  - CPU cache
---
> [!info]- 참고한 것들
> - [[10. Caches|서울대 이재진 교수님 확장형 고성능 컴퓨팅 강의 (Fall 2024)]]

## Cache

- Cache 가 필요한 이유는 instruction 을 실행하는데 이놈이 memory 에 있기 때문.
	- Memory 에 갔다오는 시간이 대략 300cycle 정도 걸리기 때문에
	- Instruction 실행하는데는 1cycle 인데 이놈 가져오는게 300cycle 이면 배보다 배꼽이 더 크다.
- Memory 에서 cache 로 올리는 비용이 있기 때문에 당연히 locality 를 고려해서 cache 를 사용해야 한다.
	- 즉, 한번 cache 로 올리는 비용이 비싸기 때문에 한번 올리고 여러번 써먹기 위해 어떤 놈이 "조만간 사용될" 지를 고려해야 하는 것.
	- Temporal locality 의 관점에서는, 한번 access 되었으면 cache 에 올라왔기 때문에 이것을 올리는 것보다는 "언제 뺄지" 가 중요하다. 이것은 뒤에 replacement 로 결정된다.
	- Spatial locality 의 관점에서는, access 된놈만 올리는게 아니라 주변 애들을 다 같이 올린다. 이 단위를 *Cache line* 이라고 한다.
	- 따라서 cache 로 올리는 비용을 생각하면, 한번만 access 되는 놈이라면 cache 에 올리는게 더 손해일수도 있다.
- 어쨋든 cache access 관련하여 두 개의 주된 result 는
	- *Hit*: 원하는 놈 $b$ 가 $k$ 번째 level 안의 cache line 에 있는 경우
	- *Miss*: 없는 경우. 이때는 $k+1$ 번째 level 에서 $k$ 번째로 $b$ 가 포함된 cache line 을 올려야 한다.
		- 여기에는 종류가 있다.
		- *Cold miss*: cache 가 비어있을 때
		- *Conflict miss*: cacheline 이 들어올 자리가 없을 때
		- *Capacity miss*: 단위시간동안 사용하는 데이터의 크기 (= *Working set*) 가 cache 의 크기보다 클때
			- 근데 사실 이건 conflict miss 랑 구분하기가 힘들다고 한다.

### Cache line

![[Pasted image 20241021105012.png]]

- 일단 *Word* 라는 것은 "한 자료형 단위" 라고 생각하면 된다.
	- 즉, 자료형이 `int` 면 *Word* 의 크기는 4byte 인 것.
- 위에서 말한 대로, spatial locality 를 위해 *Cache line* 의 단위로 데이터를 갖고 온다.
	- 이것은 여러 개의 word 로 구성된다.
- 그리고 cache line 과 동일한 크기의 memory 공간으로, memory 에서 cache 로 한꺼번에 갖고 오게 되는 memory 의 영역은 *Cache block* 이라고 부른다.
	- 여기서 좀 용어가 섞일 수 있는데,
	- 보통 *Memory block* (*block*) 이라고 하면 *word* 라고 생각하고,
	- *Cache block* 이라고 할 때만 *Cache line* 에 대응되는 놈이라고 생각하자.

### Structure

![[Pasted image 20241021105657.png]]

- Memory address 로 cache 에 접근하기 위해서 위처럼 구성되어 있다.
- 일단 전체 구조는 $S$ 개의 set 이 있고, 각 set 에 $L$ 개의 cache line 이 있으며 이 cache line 은 $B$ 개의 byte 로 구성된 형태다.
	- 각 cache line 에 대해서는 cache line 들을 구분지어주기 위한 tag 와
	- Cache line 이 유효한지를 나타내는 validity bit 이 있다.
- 보통 cache size 라고 한다면 저 valid 나 tag 는 제외한 크기를 말한다.
	- 즉, $L \times S \times B$ 인 것.
- 이때, 원하는 address 의 byte 에 접근하는 방법을 알아보자.
- Set 을 찾아가는 것은 address 의 set index field 를 참고해서 어느 set 에 있는지 알아낸다.
- Set 내에서 원하는 cacheline 을 찾는 것은 address 의 tag field 를 참고한다.
	- 얘는 index 로 접근하는게 아니라 cache line 에 적힌 tag 를 비교해서 찾아낸다.
- Cache line 안에서 byte 를 찾는 것은, memory address 의 나머지 부분을 offset 으로 해서 찾아가게 된다.