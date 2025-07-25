---
tags:
  - c
  - c-process
date: 2025-07-25
aliases:
  - atexit
  - _exit
---
## TL;DR

> [!tip]- `atexit()` 헤더파일
> ```c
> #include <stdlib.h>
> ```

- `atexit()` 으로 process 가 종료될 때 실행될 `void (*func)(void)` 타입의 [[Function Pointer (C Type)|함수 포인터]] 를 등록할 수 있다.
- 가령 아래의 프로그램을 실행시키면

```c
#include <stdio.h>
#include <stdlib.h>

void atexit_callback(void)
{
	printf("'atexit_callback' called.\n");
}

int main(void)
{
	atexit(atexit_callback);
	printf("atexit callback registered.\n");
	return 0;
}
```

- 이렇게 종료될때 실행된다.

![[Pasted image 20250725105427.png]]

### `atexit` 이 정상 작동하는 경우와 그렇지 않은 경우

- `atexit()` 으로 등록된 함수는 `main` 함수가 `return` 되거나 process 가 `exit()` 로 종료될때 호출된다.
- `return` 의 예시는 위에서 봤으니까, `exit()` 예시도 한번 보면

```c
#include <stdio.h>
#include <stdlib.h>

void atexit_callback(void)
{
	printf("'atexit_callback' called.\n");
}

int main(void)
{
	atexit(atexit_callback);
	printf("atexit callback registered.\n");
	exit(0);
}
```

![[Pasted image 20250725105730.png]]

- 마찬가지로 작동하는 것을 볼 수 있다.
- 근데 이놈이 작동하지 않는 경우가 있다. 바로 `_exit()` 을 사용하는 것이다.

> [!tip]- `_exit()` 헤더파일
> ```c
> #include <unistd.h>
> ```

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

void atexit_callback(void)
{
	printf("'atexit_callback' called.\n");
}

int main(void)
{
	atexit(atexit_callback);
	printf("atexit callback registered.\n");
	_exit(0);
}
```

![[Pasted image 20250725122056.png]]

- 보면 `atexit()` 으로 등록한 callback 이 실행되지 않는다.
- 이건 `exit()` 와 `_exit()` 의 차이점에서 기인한다.
	- `exit()` 은 process 가 끝나기 전에 C runtime 에서 몇가지 작업들 (예를들면 stdout flush 나 위와 같은 `atexit()` 등) 을 한 다음에 kernel 에 exit syscall 을 날린다.
	- 하지만 `_exit()` 은 이런것들을 하지 않고 바로 exit syscall 을 날린다. 그래서 `atexit()` 이 작동하지 않는 것.