---
tags:
  - terms
  - os-memory
  - os
aliases:
  - Memory hierarchy
date: 2024-12-03
---
> [!info]- 참고한 것들
> - [[10. Caches|서울대 이재진 교수님 확장형 고성능 컴퓨팅 강의 (Fall 2024)]]

## 메모리 계층 구조

![[Pasted image 20241021101314.png]]

- 항상 모든 재화라는 것은 싸고 별로거나 비싸고 좋거나 이다.
- 저장공간도 마찬가지이다: 싸지만 느리거나 빠르지만 비싸거나이다.
- 따라서 빠른 대신 비싼 놈을 작은 사이즈로 구비해놓고 느리지만 싼 애들을 큰 사이즈로 구비해놓아 이들을 hybrid 로 써먹는 것이 메모리 계층구조이다.
- Memory 도 storage 에 비하면 cache 의 역할을 하지만 replacement 같은 것이 SW 로 구현되어있다는 점에서 SW cache 라고 부르고
	- CPU cache 는 replacement 도 HW 적으로 되어 있기 때문에 HW cache 라고 부른다.
- 참고) DRAM 에 비해 SRAM 은 더 빠르지만 transistor 도 더 많이 들어가 비싸다고 한다.