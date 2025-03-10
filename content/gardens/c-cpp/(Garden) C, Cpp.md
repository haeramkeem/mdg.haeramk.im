---
date: 2024-07-29
---
> [!tip] 이걸 왜 정리하지?
> - 요즘은 챗 지피티 (엑셀 팡션?) 가 잘 해주기 때문에 이런 글이 별로 쓸데 없긴 하다.
> - 그럼에도 적는 이유는,
> 1. ChatGPT 는 불필요한 정보까지 다 알려줘서 너무 느리고
> 2. 원래 뭔가를 "기억" 한다는 것은 그 대상에 관심을 가지는 행위이기 때문이다. 즉, ChatGPT 에 물어보면 다 나오는 것이지만 굳이 이렇게 정리한다는 것은 주인장으로 하여금 그만큼 관심을 가지게 하고 따라서 더 오래 기억될 수 있게 하는 것이다.

## 개요

- 어쩔 수 없다
- 벼는 익을수록 고개를 숙인다는데
- 고개를 숙이자니 결국 보이는 것은 C 와 C++ 인 것을

## 작물들

### C

- Debug
	- [[함수 진입, 탈출 메세지 출력하기 (C Debug)|함수 진입, 탈출 메세지 출력하기]]
- IO
	- [[Direct IO, O_DIRECT (C File IO)|Direct IO, O_DIRECT]]
- Kernel
	- [[File IO in Kernel Module (C Linux Kernel)|File IO in Kernel Module]]
	- [[Printk Formatting (C Linux Kernel)|Printk Formatting]]
	- [[세상 간단한 Kernel module 예시 (C Linux Kernel)|세상 간단한 Kernel module 예시]]
- Memory
	- [[Memory Dynamic Allocation (C Memory)|Memory Dynamic Allocation]]
	- [[Memory Utils (C Memory)|Memory Utils]]
- POSIX Thread
	- [[세상 간단한 POSIX thread (pthread) 예시 (C Thread)|세상 간단한 POSIX thread (pthread) 예시]]
- String
	- [[Numeric String Utils (C String)|Numeric String Utils]]
- 자료형
	- [[Function Pointer (C Type)|Function Pointer]]
	- [[Struct (C Type)|Struct]]

### C++

- [[Command-line Arguments (C++)|Command-line Arguments]]
- [[Dynamic Type Casting (C++)|Dynamic Type Casting]]
- [[Move Ownership (C++)|Move Ownership]]
- [[Vexing Parse Problem (C++)|Vexing Parse Problem]]
- Async
	- [[Promise, Future (C++ Async)|Promise, Future]]
- Char, String
	- [[Converting Char Case (C++ String)|Converting Char Case]]
	- [[Converting Char to String (C++ String)|Converting Char to String]]
	- [[String 변수를 auto 로 생성하지 말자 (C++ String)|String 변수를 auto 로 생성하지 말자]]
- Class
	- [[Constant Method (C++ Class)|Constant Method]]
	- [[Constructor (C++ Class)|Constructor]]
	- [[Copy Assignment Operator (C++ Class)|Copy Assignment Operator]]
	- [[Copy Constructor (C++ Class)|Copy Constructor]]
	- [[Destructor (C++ Class)|Destructor]]
	- [[Friend Class (C++ Class)|Friend Class]]
	- [[Move Constructor (C++ Class)|Move Constructor]]
- Concurrency control
	- [[Atomic Type (C++ Concurrency)|Atomic Type]]
	- [[Lock Guard (C++ Concurrency)|Lock Guard]]
	- [[Lock Function (C++ Concurrency)|Lock Function]]
	- [[Mutex (C++ Concurrency)|Mutex]]
	- [[Shared Mutex (C++ Concurrency)|Shared Mutex]]
	- [[Unique Lock (C++ Concurrency)|Unique Lock]]
- Number
	- [[Float, Double Point, IEEE 754 (C++ Number)|Float, Double Point]]
	- [[Integer (C++ Number)|Integer]]
- [[Optional Object (C++ Optional)|optional]]
	- [["bugprone-unchecked-optional-access" Error (C++ Optional)|"bugprone-unchecked-optional-access" Error]]
	- [[Creating Optional Object (C++ Optional)|Creating Optional Object]]
- Pointer
	- [[Reference Type (C++ Pointer)|Reference Type]]
	- Smart pointer
		- [[Converting Smart Pointer to Pointer (C++ Pointer)|Converting Smart Pointer to Pointer]]
		- [[Creating Smart Pointer (C++ Pointer)|Creating Smart Pointer]]
- STL
	- [[size() 의 사칙연산 주의할 것 (C++ STL)|size() 와 사칙연산]]
	- `std::map`
		- [[Map 루프 (C++ STL)|Map 루프]]
		- [[Map 원소 삭제하기 (C++ STL)|Map 원소 삭제하기]]
		- [[Map 원소 존재여부 검사하기 (C++ STL)|Map 원소 존재여부 검사하기]]
		- [[Map 원소 추가하기 (C++ STL)|Map 원소 추가하기]]

### GCC, LLVM

- `gcc`
	- [[gcc - Preprocessing Config 확인하기|Preprocessing Config 확인하기]]

### GDB, LLDB

- [[gdb - Breakpoint 걸기|Breakpoint 걸기]]
- [[gdb - Variable 값 확인하기|Print Variable 값 확인하기]]
- [[gdb - Process 진행하기|Running Process 진행하기]]
- [[gdb - Thread 디버깅하기|Thread 디버깅하기]]
- [[gdb - 디버깅 시작하기|디버깅 시작하기]]

### Plugins

- `ctags`
	- [[Basic Usage (ctags)|Basic Usage]]
	- [[Debug Compile (cmake)|Debug Compile]]
- `gprof`
	- [[Basic Usage (gprof)|Basic Usage]]
- `make`, `cmake`
	- [[Basic Usage (cmake)|Basic Usage]]
	- [[Debug Compile (cmake)|Debug Compile]]
	- [[Library Configuration (cmake)|Library Configuration]]
	- [[Macro Setup (make, cmake)|Macro Setup]]
	- [[Make Clean (make, cmake)|Make Clean]]
	- [[Print Compile Flags (cmake)|Print Compile Flags]]
- `valgrind`
	- [[Basic Usage (valgrind)|Basic Usage]]