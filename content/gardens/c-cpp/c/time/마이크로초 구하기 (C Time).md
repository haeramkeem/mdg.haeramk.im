---
tags:
  - c
  - c-time
date: 2025-04-03
aliases:
  - timeval
---
> [!info]- 참고한 것들
> - [어떤 네이버 블로그](https://m.blog.naver.com/japchae153/222295431893)

## TL;DR

> [!tip] Header 파일
> ```c
> #include <sys/time.h>
> ```

- C 에서 UNIX time 을 마이크로초 단위로 얻기 위해서는 `struct timeval` 와 `gettimeofday()` 를 이용하면 된다.

```c
struct timeval time;
gettimeofday(&time, NULL);
```

- 이렇게 하면 여러 단위의 값이 담기는데, 마이크로초를 구하기 위해서는 다음의 계산식을 이용하면 된다.

```c
uint64_t usec = time.tv_sec * (int)1e6 + time.tv_usec;
```

- 이건 macro 를 설정해두면 편하다.

```c
#define MICROSEC(time) \
(time.tv_sec * (int)1e6 + time.tv_usec)
```

## 코드 실행 시간 예제

- 보통은 이짓을 하는 이유는 코드의 어떤 부분에 대해 실행시간이 얼마나 걸리냐를 알기 위해서이다.
- 그래서 이런식으로 하면 실행시간을 구할 수 있다.

```c
#include <stdint.h>
#include <stdio.h>
#include <sys/time.h>

#define MICROSEC(time) \
	(time.tv_sec * (int)1e6 + time.tv_usec)

void job(void)
{
	for (int i = 0; i < (1 << 20); i++)
		;
}

int main(void)
{
	struct timeval time;
	uint64_t usec;

	// 시작시간
	gettimeofday(&time, NULL);
	usec = MICROSEC(time);

	// 뭔가 막 해 막
	job();

	// 끝시간
	gettimeofday(&time, NULL);
	usec = MICROSEC(time) - usec;

	printf("Time elapsed: %lu\n", usec);
}
```

![[Pasted image 20250403182059.png]]