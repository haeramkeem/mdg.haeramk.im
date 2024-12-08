---
tags:
  - c
  - c-memory
aliases:
  - memset
  - memcpy
date: 2024-10-10
---
> [!info]- 참고한 것들
> - [Cpp reference: memcpy](https://en.cppreference.com/w/c/string/byte/memcpy)
> - [Cpp reference: memset](https://en.cppreference.com/w/c/string/byte/memset)

## Memory 관련 util 들

- 을 정리해 보자.

## `memcpy`: Memory copy

> [!tip]- Header file: `string.h`
> ```c
> #include <string.h>
> ```

- 이름 그대로 memory 공간을 그대로 복사하는 것이다.
- 선언은 이렇게 돼있다:

```c
void *memcpy(void *dst, const void *src, size_t cnt);
```

- 주목 (참고?) 할 점 두 가지는:
	- `src` 가 `const void *` 로 되어 있다. 즉, `memcpy` 에서는 `src` 의 내용을 변경하지는 않는다는 것.
	- 반환형이 `void *` 이다. 여기서는 `dst` 를 반환한다고 한다 (사용 안해도 됨).
- 예시 코드

```c
#include <stdio.h>
#include <string.h>

struct Example {
	int integer;
	char alphabet;
};

int main() {
	struct Example ex1;
	ex1.integer = 123;
	ex1.alphabet = 'A';

	struct Example ex2;
	memcpy(&ex2, &ex1, sizeof(struct Example));

	printf("ex2.integer=%d\n", ex2.integer);
	printf("ex2.alphabet=%c\n", ex2.alphabet);
}
```

![[Pasted image 20241010074909.png]]

- 위 예시에서는 [[Struct (C Type)|struct]] 를 복사했지만, 자료형에 관계없이 모두 가능하다.

## `memset`: Memory set

> [!tip]- Header file: `string.h`
> ```c
> #include <string.h>
> ```

- 이것도 이름 그대로 memory 공간을 같은 값으로 채우는 것이다.
	- 물론 이걸 `for` loop 으로 할 수 있는데, `memset` 은 당연히 [[Single Instruction Multiple Data, SIMD (Arch)|SIMD]] optimization 이 되어 있어 일반적으로는 `memset` 을 사용하는 것이 더 빠르다 ([고 한다](https://stackoverflow.com/a/7367716)).
- 선언은:
	- 보면 "채우는 값" (`val`) 이 `int` 이다. 즉, 정수 혹은 이와 유사한 놈 (문자) 이 가능할 듯하다.

```c
void *memset(void *dst, int val, size_t cnt);
```

- 예시 코드:

```c
#include <stdio.h>
#include <string.h>

int main() {
	char str[] = "abcdefghijklmnopqrstuvwxyz";
	memset(str, 'A', 7);
	printf("str=%s\n", str);
}
```

![[Pasted image 20241010081004.png]]