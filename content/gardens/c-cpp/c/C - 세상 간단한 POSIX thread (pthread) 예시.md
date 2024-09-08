---
tags:
  - c
date: 2024-09-08
aliases:
  - pthread
---
## TL;DR

```c
#include <stdio.h>
#include <pthread.h>

void* thread_func(void* arg);

int main() {
	pthread_t threads[5];
	int in[5];
	int* out;

	for (int i = 0; i < 5; i++) {
		in[i] = i;
		if(pthread_create(threads + i, NULL, thread_func, (void*)(in + i)) != 0) {
			printf("Thread (%d) failed to create.\n", i);
		}
	}

	for (int i = 0; i < 5; i++) {
		if(pthread_join(threads[i], (void**)&out) != 0) {
			printf("Thread (%d) failed to join.\n", i);
		}
	}

	return 0;
}

void* thread_func(void* arg) {
	int* id = (int*)arg;
	for (int i = 0; i < 2; i++) {
		printf("Thread(%d)\n", *id);
	}
	pthread_exit(arg);
}
```

- 결과 예시

![[Pasted image 20240908215910.png]]

- 간단한 주의사항 설명:
	- 일단 기본적으로 `pthread.h` 를 추가해 줘야 한다.
	- Thread 에 인자를 넣어줄 때는 `pthread_create` 의 4번째 인자를 활용하면 된다.
		- 하나밖에 못넣으니까 여러개를 넣고자 한다면 [[C - 구조체 (struct) 정리|구조체]] 를 활용하자.
		- 안넣고 싶으면 `NULL` 을 박으면 된다.
	- Thread 에서 결과를 받을 때는 `pthread_join` 의 두번째 인자를 활용하면 된다.
		- 다만 주의할 것은 double pointer 라는 것.
		- Thread 내에서 보내주는 값은 `pthread_exit` 에 넣어주면 된다.
		- 안받고 싶으면 `pthread_join` 이나 `pthread_exit` 둘 다 `NULL` 을 박으면 된다.