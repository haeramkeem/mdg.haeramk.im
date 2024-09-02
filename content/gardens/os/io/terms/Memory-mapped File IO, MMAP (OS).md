---
tags:
  - os
  - os-io
date: 2024-08-27
---
> [!info]- 참고한 것들
> - [[19. Memory Mapping, Shared Memory, Swap|서울대 김진수 교수님 고급운영체제 강의 (Spring 2024)]]

## MMAP

- 간단하게 말하면 파일을 virtual address space 에 매핑해놓고 pointer access 로 file access 를 하는것인데
- 이렇게 알고 있으면 좀 뜬구름 잡는것 같은 기분이 든다.
	- 왠지 virtual address 와 storage 가 직통으로 연결되어있는거 같자나?
- 그래서 좀 더 구체적으로 말하면,
	- 파일을 읽어 kernel space (physical memory space) 의 page cache 공간에 올리고,
	- User space (virtual memory space) 에 저 공간을 mapping 해놓은 것이다.
- 즉, MMAP 이라고 해서 주소로 접근했을 때 바로 storage 로 찌르는 것이 아니라는 것. 어차피 memory 상에 file 을 올려야 하는 것은 다른 IO 방법들과 마찬가지이고, address translation 방법만 다른거라고 생각하면 된다.
- 다르게 말하면, MMAP 은 page cache 에 매핑된 virtual address space 라고 이해하면 된다.
	- 따라서 처음에 MMAP 영역을 생성하면, virtual space 에만 생성되고 실질적으로는 아무런 mapping 도 일어나지 않는다.
	- 그리고 그 영역에 접근하면 그때 (mapping 이 없기 때문에) page fault 가 일어나며:
		- File 을 읽어 page cache 에 올리고
		- 이 page cache 공간에 mapping 하는 방식으로 handler 가 돈다.

### 장단점

- MMAP 의 장점은
	- File access 를 memory access API 로 할 수 있다는 것이다.
		- MMAP 을 사용하지 않았다면 POSIX API (`read`, `write`) 로 파일을 접근해야 하는 반면
		- MMAP 을 해놓으면 pointer reference 처럼 memory 접근하듯이 file 에 접근할 수 있다.
	- 그리고 (뒤에 설명할 file IO 비교에서 볼 수 있을 텐데) `memcpy` 오버헤드도 적다
- 다만 단점은
	- 일반 file 과는 좀 다르기 때문에 pipe, socket 같은 기능은 못쓴다

### 다른 방법들과의 차이점

- 아래 네 방법을 각각 살펴보자.
	- 여기서 점선 위부분은 user memory space 이고, 아래 부분은 kernel memory space 이다.

![[Pasted image 20240612193953.png]]

1. 일반 POSIX `read` API:
	- 파일을 읽어 kernel 의 page cache 로 4KB frame 를 올린 다음
	- User space 의 buffer 로 `memcpy` 하여 접근하는 방식이다.
2. 일반 POSIX `read` API 에 `O_DIRECT` 옵션을 준 경우
	- 이 경우에는 kernel page cache 로 올리는 것이 아닌 user space 로 바로 올린다.
	- 물론 더 빠르지만 page cache 의 이점 을 누릴 수는 없더라.
3. `fopen`, `fgets` C library
	- 이 library 를 사용하게 되면 kernel page cache 로 올라왔다가
	- C library 에 추가적으로 `memcpy` 하여 buffering 되고
	- User space 의 buffer 로 또 `memcpy` 하여 접근하는 방식이다.
	- 그래서 뭐 line 별로 잘라서 읽어오는 등의 아주 편한 기능을 제공하지만
	- page cache, C-lib, user-space 세곳에 버퍼링을 하는 오버헤드가 크다.
4. `mmap`
	- 이때는 page cache 로 올라온 file 을 user space 에 바로 매핑해서 접근하게 된다.

### Syscall reference

![[Pasted image 20240612192428.png]]

- `mmap()` syscall 로 MMAP 을 수행할 수 있고, 위 그림과 같다고 한다.
	- `addr`: 이것은 hint 다; NULL 로 주면 kernel 이 알아서 설정
	- `length`: paging 이 사용되기에 당연히 page size 의 배수
	- `prot`: protection 정보 (RW, RO 등)
	- `flag`: 모드 (Private, Shared, 등)
	- `fd`, `offset`: file mapping 을 할 때 사용 - 열려있는 파일의 file discriptor 와 시작주소를 넘겨줌
	- return 값은 할당된 공간의 virtual addr 다