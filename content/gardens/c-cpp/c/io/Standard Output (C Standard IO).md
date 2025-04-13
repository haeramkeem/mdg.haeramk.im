---
tags:
  - c
  - c-io
date: 2025-04-08
aliases:
  - stdout
  - fflush
  - setbuf
  - setvbuf
---
> [!info]- 참고한 것들
> - [스댕](https://stackoverflow.com/a/1716621)

## TL;DR

- 표준출력(stdout) 으로 출력하는 것이라면 C 를 한번이라도 써봤으면 누구나 안다. 헬로월드 쳐야되니까.

```c
printf("Message");
```

## Buffering

- stdout 은 줄별로 buffering 이 된다. 따라서 아래의 코드를 실행하면 `AB` 가 함께 출력된다.

```c
#include <stdio.h>
#include <unistd.h>

int main(void)
{
	printf("A");
	sleep(1);
	printf("B\n");
}
```

### `fflush()`

- 근데 누군가는 이런 buffering 되는게 맘에 안들 수도 있다. 따라서 `fflush` 로 강제로 buffering 되어있는 것을 flush 할 수 있다.

```c {7}
#include <stdio.h>
#include <unistd.h>

int main(void)
{
	printf("A");
	fflush(stdout);
	sleep(1);
	printf("B\n");
}
```

- 위의 코드를 실행하면 `A` 가 출력되고 1초 뒤에 `B` 가 따라붙는다.

### `setbuf()`, `setvbuf()`

- 아니면 `setbuf` 로 stdout stream 에 대한 buffering 을 아주 꺼버릴 수도 있다.

```c {6}
#include <stdio.h>
#include <unistd.h>

int main(void)
{
	setbuf(stdout);
	printf("A");
	sleep(1);
	printf("B\n");
}
```

- `setbuf` 대신 좀 더 다양한 기능을 제공하는 `setvbuf` 를 사용해도 된다. 아래처럼 사용하면 된다고 한다.

```c
setvbuf(stdout, NULL, _IONBF, 0);
```