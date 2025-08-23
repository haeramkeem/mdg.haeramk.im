---
tags:
  - c
  - c-string
date: 2025-03-28
---
> [!info]- 참고한 것들
> - [스댕 1](https://stackoverflow.com/a/23657072)
> - [스댕 2](https://stackoverflow.com/a/5947802)

## TL;DR

- UNIX 기반 OS 의 터미널에서 color code 를 쓸 때는 다음과 같이 macro 를 지정해 놓으면 편하다:

```c
#define COLOR_RESET     "\x1B[0m"
#define COLOR_BLACK     "\x1B[30m"
#define COLOR_RED       "\x1B[31m"
#define COLOR_GREEN     "\x1B[32m"
#define COLOR_YELLOW    "\x1B[33m"
#define COLOR_BLUE      "\x1B[34m"
#define COLOR_MAGENTA   "\x1B[35m"
#define COLOR_CYAN      "\x1B[36m"
#define COLOR_GRAY      "\x1B[37m"
```

- 폰트 관련해서, **볼드체** 로 표시하고싶으면 이걸 사용하면 된다.

```c
#define COLOR_BOLD  "\x1B[1m"
```

- 그리고 사용할 때는 이렇게 하면 된다:

```c
#include <stdio.h>

#define COLOR_RESET "\x1B[0m"
#define COLOR_RED "\x1B[31m"

int main(void)
{
	printf(COLOR_RED "red\n" COLOR_RESET);
}
```

![[Pasted image 20250328131711.png]]