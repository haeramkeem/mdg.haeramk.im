---
tags:
  - os
  - os-memory
date: 2024-08-27
aliases:
  - CR3
  - PTBR
---
> [!info]- 참고한 것들
> - [[18. Virtual Memory|서울대 김진수 교수님 고급운영체제 강의 (Spring 2024)]]

## CR3 (x86)

- [[Virtual Memory (Memory)|Virtual memory address]] 와 physical memory address 간의 매핑은 [[Page Table (Memory)|page table]] 에 저장되어 있다.
	- 당연히 virtual memory space 는 process 별로 갖고있기 때문에, 저 page table 도 process 마다 갖고 있다.
- 근데 이 page table 은 OS 가 관리한다. 즉, memory 안에 있다는 말이다. 그럼 [[Memory Management Unit, MMU (Memory)|MMU]] 나 [[Translation Lookaside Buffer, TLB (Memory)|TLB]] 와 같은 HW 입장에서 이 page table 의 위치를 어떻게 알 수 있을까?
- 이떄 사용되는게 (x86 아키텍쳐 기준) *CR3* 레지스터다.
	- OS 는 process scheduling 때 저 *CR3* 에 실행할 process 의 page table 주소를 넣는다.
		- 이때는 당연히 page table 의 physical address 이다. Virtual address 를 변환하기 위한 page table 의 주소를 virtual address 로 명시하는건 말이 안되자나?
	- 이후 CPU 가 어떤 virtual address 를 요청하면 MMU 가 CR3 를 보고 address translation 을 하여 해당 physical address 로 접근하게 되는 구조다.
- 따라서 *CR3* 는 CPU 에서 돌아가는 OS 와 HW 장치인 MMU, TLB 와의 소통의 창구인 셈이다.
	- CPU 가 남의 도움을 받지 않고 접근할 수 있는 유일한 공간이 레지스터이기에, CR3 라는 특수 목적 레지스터를 사용하는 것.