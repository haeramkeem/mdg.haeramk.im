---
tags:
  - os
  - os-io
date: 2024-08-27
aliases:
  - MMU
---
> [!info]- 참고한 것들
> - [[18. Virtual Memory|서울대 김진수 교수님 고급운영체제 강의 (Spring 2024)]]

## 핵심 주소 변환 유닛

![[Pasted image 20240827133539.png]]

- CPU 는 page 단위의 [[Virtual Memory (Memory)|virtual memory address]] 를 사용한다. 그리고 이것을 frame 단위의 실제 physical memory address 로 바꿔주는 HW 가 *Memory Management Unit*, *MMU* 이다.
- 이때 MMU 를 도와 기존에 translate 한 것들을 캐싱하는 유닛이 [[Translation Lookaside Buffer, TLB (Memory)|TLB]] 이다.
- Address translation 을 하려면 page table 을 알아야 하는데, 이때 OS 가 MMU, TLB 에게 page table 의 위치를 알려주기 위한 레지스터가 [[Page Table Base Register, CR3 (Memory)|CR3]] 이다.