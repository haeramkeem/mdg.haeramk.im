---
tags:
  - c
  - c-memory
aliases:
  - malloc
  - calloc
  - free
date: 2024-10-09
---
> [!info]- 참고한 것들
> - [Cpp reference - malloc](https://en.cppreference.com/w/c/memory/malloc)
> - [Cpp reference - calloc](https://en.cppreference.com/w/c/memory/calloc)

## Heap memory allocation

- `malloc`, `calloc` 는 C 언어에서 [[Virtual Memory (Memory)|Heap memory]] 를 동적으로 할당하는 대표적인 함수이고, `free` 는 이걸 다시 반환하는 함수이다.
	- 참고로 말하자면, 얘네들은 syscall 은 아니다. Heap memory 공간은 사전에 어느정도 늘어나 있고, 이 공간 중 일부를 할당받아 사용하는 것.
- 동적 할당을 하는 이유에 대해서는, 어떤 놈의 lifecycle 을 내 맘대로 가져가고 싶기 때문이다.
	- 즉, static allocation 을 위해 할당된 메모리 공간은 lifecycle 에 제약사항이 있기 때문이다.
		- 가령 함수 내의 local variable 같은 경우에는 [[Virtual Memory (Memory)|Stack memory]] 에 저장되기 때문에 함수가 종료되면 function record 가 날라가면서 같이 반환되고,
		- Global variable 같은 경우에는 process 가 살아있는 동안 계속 살아있기 때문.
	- 근데 dynamic allocation 을 하면 언제 생성하고 언제 사라질지를 programmer 가 직접 제어할 수 있다.
- 그럼 하나하나 알아보자.

## `malloc`: Memory allocation

> [!tip]- Header file: `stdlib.h`

- `malloc` 은 *Memory allocation* 의 약자로 인자로 준 크기 만큼만 할당해 주는 제일 단순한 형태의 함수이다.
- 함수 선언은 다음과 같다:
	- 얼만큼 할당할지 (`size`) 를 인자로 받아 그만큼을 할당해 주고,
	- 시작 포인터 (`void *`) 를 반환한다.

```c
void *malloc(size_t size);
```

- 한 가지 주의할 점은 `malloc` 은 내용을 초기화해주지는 않는다는 것이다.
	- 즉, 쓰레기 값이 충분히 들어있을 수 있으니 항상 초기화를 해주는 습관을 들이자.
- 배열을 선언하는 예시 참고해라:
	- 그냥 크기 10 짜리 배열을 선언하고, index 에 2를 곱한 값으로 배열을 채워 출력해보는 예시다.

```c {5,10}
#include <stdio.h>
#include <stdlib.h>

int main() {
	int *arr = malloc(10 * sizeof(int));
	for (int i = 0; i < 10; i++) {
		arr[i] = i * 2;
		printf("arr[%d]=%d\n", i, arr[i]);
	}
	free(arr);
}
```

![[Pasted image 20241009143844.png]]

## `calloc`: Contiguous allocation

> [!tip]- Header file: `stdlib.h`

- `calloc` 은 *Contiguous allocation* 의 약자로 [[#`malloc` Memory allocation|malloc]] 이랑 유사하지만 배열을 위한 공간을 할당하기 위한 좀 더 편리한 기능을 제공한다.
	- 일단 `malloc` 에서는 값들을 초기화해주지 않는다. 즉, 쓰레기 값이 들어있을 수도 있는 것. 근데 `calloc` 은 `0` 으로 초기화해준다.
	- 그리고 인자도 좀 다르다. "배열" 을 위한 공간을 할당해주는 만큼, "인자의 갯수" 와 "인자의 크기" 를 인자로 받는다.
- 따라서 함수 선언은 다음과 같다:

```c
void *calloc(size_t count, size_t entry_size);
```

- 위에서의 배열 선언 예시를 `calloc` 으로 해보면:

```c {5,11}
#include <stdio.h>
#include <stdlib.h>

int main() {
	int *arr = calloc(10, sizeof(int));
	for (int i = 0; i < 10; i++) {
		printf("arr[%d]=(init)%d ", i, arr[i]);
		arr[i] = i * 2;
		printf("(val)%d\n", arr[i]);
	}
	free(arr);
}
```

![[Pasted image 20241009143813.png]]