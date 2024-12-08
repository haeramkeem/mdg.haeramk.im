---
tags:
  - terms
  - os
  - os-memory
aliases:
  - Virtual Address Space
  - VAS
  - Heap memory
  - Stack memory
date: 2024-10-17
---
> [!info]- 참고한 것들
> - [[18. Virtual Memory|서울대 김진수 교수님 고급운영체제 강의 (Spring 2024)]]
> - [[04. Processes and Threads|서울대 이재진 교수님 확장형 고성능 컴퓨팅 강의 (Fall 2024)]]

## Virtual Address Space (VAS)

- Process 가 사용하는 virtual memory address 의 주소공간을 *Virtual Address Space* (*VAS*) 라고 하는데,
- 이 공간을 어떻게 사용하고 있냐... 뭐 흔히 보이는 code-data-heap-stack 그림이다:

![[Pasted image 20240612154456.png]]

- 일단 어느 정도의 padding (*Unused*) 공간이 등장한 다음에:
- *Code* 는 read-only 이고, 따라서 *Read-only segment* 라고도 불린다.
- *Data* 는 당연히 read-write 공간이고, 따라서 *Read-write segment* 라고도 불린다.
	- 여기에는 대표적으로 global variable 이 저장된다.
	- 여기 공간은 또 두 개로 나눌 수 있는데
		- 처음부터 초기화되어 있는 값들은 *Initialized Data* (`.data`) 에 담기고
		- 초기화되어있지 않은 값들은 *Uninitialized Data* (`.bss`) 에 담긴다.
			- *BSS* 라는게 있는데, *Block Started Symbol* 이란 뜻이다. 일단은 *BSS* 란 용어를 보면 uninitialized data 공간 말하는구나... 라고 생각하자.
- *Heap* 공간은 메모리 동적할당을 위한 공간인데,
	- 많이 쓰는 [[Memory Dynamic Allocation (C Memory)|malloc]] 은 library 함수이고 syscall 이 아니다.
	- `malloc` 은 heap 공간을 갖고 장난치다가 여기에 공간이 부족해 지면 `sbrk` 라는 syscall 을 부르고 이때 heap 이 늘어나는 것
- *Stack* 공간은 당연히 function call stack 이다.
	- Local memory 의 경우 여기에 들어간다.
- *Heap* 과 *Stack* 은 역방향으로 커져 차지하는 공간을 서로 견제하도록 되어 있다.
- *Heap* 와 *Stack* 사이에는 *Shared Library* 공간이 들어가기도 한다.
	- 즉, shared library 의 경우에는 code 에 넣는 것은 비효율적이니까 그냥 address mapping 만 저기 중간에 해주는 것.
- 그리고 stack 아래에는 kernel memory space 가 있어서 kernel mode 로 진입하면 여기로 가게 된다.
	- 옛날에는 kernel virtual memory 공간 전체가 다 붙어있어서 단순히 Virtual addr 를 bitwise operation 하는 것으로 여기로 진입할 수 있었다. (물론 kernel mode 라는 전제 하에.)
	- 하지만 이제는 [meltdown attack](https://www.usenix.org/conference/usenixsecurity18/presentation/lipp) 라는 취약점이 발견되어 user VAS 공간에 kernel VAS 는 최소한만 남겨두고 완전히 분리시킨다고 한다.