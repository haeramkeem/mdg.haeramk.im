---
tags:
  - arch
  - arch-cache
date: 2024-10-09
aliases:
  - Cache write policy
  - Write through
  - Write back
  - Write allocate
  - No write allocate
---
> [!info]- 참고한 것들
> - [[10. Caches|서울대 이재진 교수님 확장형 고성능 컴퓨팅 강의 (Fall 2024)]]

## Cache Write Policies

- Write 시에 cache 가 끼면 어떻게 작동하는 것이 좋을까. 여기에는 여러가지의 정책이 있다.
- 크게는 hit 시에 어떻게 할지 (hit policy) 와 miss 시에 어떻게 할지 (miss policy) 가 있다.

### Hit policy

- Write 시에 cache hit 이 발생하면, 두가지 policy 가 가능하다.
- *Write through*: Cache 와 mem 둘 다 write 하는 것
	- 당연히 느리다.
	- 근데 구현이 쉽기도 하고, 항상 cache 와 mem 의 데이터가 일치하기 때문에 consistency 문제가 없다.
- *Write back*: Cache 에만 write 하는 것
	- 당연히 빠르다 (read 와 write 의 속도가 같다).
	- 그럼 언제 mem 에 write 되냐: evict 시에 수행한다.
		- 즉, dirty bit 를 유지해야 한다는 소리.
	- 또한 cache 와 mem 간의 consistency 문제가 있다.
	- 하지만 빠르다. 그래서 보통은 이 정책을 사용한다.

### Miss policy

- Write 시에 miss 가 발생하면, 이때에도 두가지 policy 가 가능하다.
- *Write allocate*: Cache 로 갖고와서 write 하기
- *No write allocate*: Cache 로 갖고오지 않고 mem 에 바로 write 하기

### Mix

- 저 hit policy 와 miss policy 두개를 섞어보자.
- *Write through* + *Write allocate*
	- 모든 write 는 cache 와 mem 에 전부 적힌다.
- *Write through* + *No write allocate*
	- 모든 write 는 mem 으로 가고, hit 일때는 cache 내용도 바뀐다.
- *Write back* + *Write allocate*
	- Sequential write 에 아주 좋다: Write allocate 로 miss 시에 가져온 뒤에는 한동안 hit 이 나고, cache 에만 적으므로 (Write back) 매우 빠르다.
- *Write back* + *No write allocate*
	- 데이터가 있는곳에만 적는다. Cache 에 있으면 cache 에만 적고, mem 에 있으면 mem 에만 적는다.