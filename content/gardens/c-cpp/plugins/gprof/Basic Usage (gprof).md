---
tags:
  - c-cpp
  - c-cpp-gprof
aliases:
  - gprof
date: 2025-02-24
---
> [!info]- 참고한 것들
> - [스댕 - CMakeLists](https://stackoverflow.com/a/26657026)
> - [스댕 - CMake cmd](https://stackoverflow.com/a/40922025)
> - [네이버 블로그](https://blog.naver.com/hermet/175053298)

## 개요

- `gprof` 는 `gcc` compile suite 에서 제공하는 profiling tool 이다.
- 이놈은 특정 시간 (기본적으로는 0.01 초) 마다 어떤 함수가 실행되고 있는지를 체크하고 이것으로 각 함수의 호출 빈도와 실행 시간 등의 통계를 내놓는다.
	- 즉, 함수가 호출되는 정확한 빈도를 보여주지는 않는다; 그건 [[함수 진입, 탈출 메세지 출력하기 (C Debug)|Instrument Function]] 을 사용하자.
	- 정확한 빈도는 아니지만, 빠르게 함수 호출 추이를 살펴보기에 좋다.

## TL;DR

- 이런 C 코드가 하나 있다고 해보자.

```c title="main.c"
#include <stdio.h>

void print()
{
	printf(format: "example\n");
}

int main()
{
	for (int i = 0; i < (1 << 20); i++)
		print();
	return 0;
}
```

- 그리고 이놈을 컴파일할때는 `-pg` 옵션을 주면 된다.

```bash
gcc -pg main.c
```

- 그리고 컴파일 된 것을 실행하면

```bash
./a.out
```

- 다음과 같이 `gmon.out` 파일이 생성된다.

![[Pasted image 20250224090728.png]]

- 이것을 `gprof` 명령어를 이용하면 읽기 편하게 변환해준다.
	- 이놈은 표준 출력으로 나오기 때문에, `tee` 나 `>` 로 파일로 저장해주면 된다.

```bash
gprof ./a.out &> gprof.txt
```

- 그럼 다음과 같은 형식으로 나오게 된다.

![[Pasted image 20250224091033.png]]

## CMake

- CMake 를 사용할 때는 `CMakeLists` 에 이런 옵션을 넣어주거나

```
add_compile_options(-pg)
add_link_options(-pg)
```

- 다음과 같은 command option 을 넣어주면 된다.

```bash
cmake -DCMAKE_CXX_FLAGS=-pg \
	-DCMAKE_EXE_LINKER_FLAGS=-pg \
	-DCMAKE_SHARED_LINKER_FLAGS=-pg \
	${PROJECT_ROOT}
```