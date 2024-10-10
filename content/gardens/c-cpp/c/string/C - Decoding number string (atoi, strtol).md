---
tags:
  - c
aliases:
  - atoi
  - strtol
date: 2024-10-10
---
> [!info]- 참고한 것들
> - [Cpp reference: atoi](https://en.cppreference.com/w/c/string/byte/atoi)
> - [Cpp reference: strtol](https://en.cppreference.com/w/c/string/byte/strtol)

## `atoi`: ASCII to integer

> [!tip]- Header file: `stdlib.h`

- ASCII 로 된 정수 "문자열" 을 "정수" 로 형변환해주는 함수이다.
	- 여기에 variation 으로 `atol` 은 `long` 타입으로,
	- `atoll` 은 `long long` 타입으로 바꿔준다.
- 선언은:

```c
int atoi(const char *str);
```

- 그리고 예제 코드:

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
	char str_num[] = "123";
	int num = atoi(str_num);
	printf("num=%d\n", num);
}
```

![[Pasted image 20241010093629.png]]

## `strtol`: String to long

> [!tip]- Header file: `stdlib.h`

- 이놈은 `atol` 처럼 문자열을 정수로 바꿔주는 놈이긴 한데 차이점이라면 Base 를 지정해줄 수 있다는 것이다.
	- 즉, 10진수뿐 아니라 16진수도 가능하다는 소리.
	- 이놈도 `atoll` 처럼 `strtoll` 은 `long long` 타입으로 바꿔주는 variation 이 있다.
- 선언은 다음과 같다.

```c
long strtol(const char *str, char **str_end, int base);
```

- 여기서 주목할 것은
	- `str_end` 는 "끝 포인터" 를 의미하는데, 약간 cursor 와 같은 느낌이라고 생각하면 된다.
		- 즉, 문자열에서 어디까지 decoding 되었냐를 가리키는 놈으로
		- 정수 하나를 decode 한 후 아직 문자열이 끝나지 않았으면 다음번에는 이 `str_end` 의 값을 다시 넣어 decode 할 수 있다.
		- 만약 이런 cursor 가 필요하지 않다면 `NULL` 을 넣어주면 된다.
- 예시 1

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
	char str_num[] = "0x123";
	long num = strtol(str_num, NULL, 16);
	printf("num=%ld\n", num);
}
```

![[Pasted image 20241010094726.png]]

- 예시 2 (`str_end` 사용하기)

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
	char str_num[] = "0x123 0x456";
	char *cursor;
	long num1 = strtol(str_num, &cursor, 16);
	printf("num1=%ld\n", num1);
	long num2 = strtol(cursor, NULL, 16);
	printf("num2=%ld\n", num2);
}
```

![[Pasted image 20241010094935.png]]