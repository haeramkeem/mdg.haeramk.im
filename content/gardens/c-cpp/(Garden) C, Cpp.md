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

- [[C - 세상 간단한 POSIX thread (pthread) 예시|세상 간단한 POSIX thread (pthread) 예시]]
- [[C - 함수 진입, 탈출 메세지 출력하기|함수 진입, 탈출 메세지 출력하기]]
- Kernel
	- [[C - printk format 정리|printk format 정리]]
	- [[C - 세상 간단한 Kernel module 예시|세상 간단한 Kernel module 예시]]

### C++

- [[Vexing Parse 문제 (C++)|Vexing Parse 문제]]
- [[명령줄 인수 (Command-line arguments) 처리하기 (C++)|명령줄 인수 (Command-line arguments) 처리하기]]
- [[소유권, move (C++)|소유권 (move)]]
- [[형변환, dynamic_cast (C++)|형변환 (dynamic_cast)]]
- Async
	- [[Promise, future 사용법 (C++ Async)|Promise, future 사용법]]
- Char, String
	- [[Char to string 변환 (C++ String)|Char to string 변환]]
	- [[Char 대소문자 변환 (C++ String)|Char 대소문자 변환]]
	- [[String 변수를 auto 로 생성하지 말자 (C++ String)|String 변수를 auto 로 생성하지 말자]]
- Class
	- [[Const 메소드 (C++ Class)|Const 메소드]]
	- [[Constructor, 생성자 (C++ Class)|Constructor, 생성자]]
	- [[Copy assignment operator, 복사 대입 연산자 (C++ Class)|Copy assignment operator, 복사 대입 연산자]]
	- [[Copy constructor, 복사 생성자 (C++ Class)|Copy constructor, 복사 생성자]]
	- [[Destructor, 소멸자 (C++ Class)|Destructor, 소멸자]]
	- [[Friend 클래스 (C++ Class)|Friend 키워드]]
	- [[Move constructor, 이동 생성자 (C++ Class)|Move constructor, 이동 생성자]]
- Concurrency control
	- [[Atomic 자료형 (C++ Concurrency)|Atomic 자료형]]
	- [[Lock guard (C++ Concurrency)|Lock guard]]
	- [[Lock 함수 (C++ Concurrency)|Lock 함수]]
	- [[Mutex 사용법 (C++ Concurrency)|Mutex 잡고 놓기]]
	- [[Shared mutex (C++ Concurrency)|Shared mutex]]
	- [[Unique lock (C++ Concurrency)|Unique lock]]
- Number
	- [[Float, Double Point, IEEE 754 (C++ Number)|Float, Double Point]]
	- [[Integer (C++ Number)|Integer]]
- [[Optional 소개 (C++ Optional)|optional]]
	- [[Optional 객체 사용하기, bugprone-unchecked-optional-access 에러 (C++ Optional)|객체 사용하기 (bugprone-unchecked-optional-access 에러)]]
	- [[Optional 객체 생성하기 (C++ Optional)|객체 생성하기]]
- Pointer
	- [[Reference 타입 (C++ Pointer)|Reference 타입]]
	- Smart pointer
		- [[Smart pointer 생성하기 (C++ Pointer)|생성하기 생성하기 (make_, use_count)]]
		- [[Smart pointer 일반 포인터로 바꾸기 (C++ Pointer)|일반 포인터로 바꾸기 (get)]]
- STL
	- [[Map 루프 (C++ STL)|Map 루프]]
	- [[Map 원소 삭제하기 (C++ STL)|Map 원소 삭제하기]]
	- [[Map 원소 존재여부 검사하기 (C++ STL)|Map 원소 존재여부 검사하기]]
	- [[Map 원소 추가하기 (C++ STL)|Map 원소 추가하기]]
	- [[size() 의 사칙연산 주의할 것 (C++ STL)|size() 와 사칙연산]]

### GDB, LLDB

- [[lldb - Breakpoint 관련|Breakpoint 관련]]
- [[lldb - CMake 세팅하기|CMake 세팅하기]]
- [[lldb - Variable 관련|Variable 관련]]