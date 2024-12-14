---
tags:
  - c
  - c-type
aliases:
  - struct
  - 구조체
date: 2024-10-06
---
## 란?

- 구조체는 OPP 의 입장에서 보면 [[Constructor (C++ Class)|class]] 와 유사한 면이 있다.
	- 여러 자료형의 필드들을 갖고있다는 점이나, 각 필드를 `.` 연산자로 접근하기 때문.
- 물론 C 는 OPP 언어가 아니기 때문에 class 는 아니다; 정확하게 말하면 구조체는 "Memory 공간을 해석하는 지침서" 정도가 된다.
- 예를 들어보자.

```c
#include <stdio.h>

struct Example {
	int integer;
	char character;
};

int main() {
	struct Example ex;
	printf("&ex: %p\n", &ex);
	printf("&ex.integer: %p\n", &ex.integer);
	printf("&ex.character: %p\n", &ex.character);
}
```

![[Pasted image 20241001105934.png]]

- 이 결과가 의미하는 것은 다음과 같다.

![[Pasted image 20241001110710.png]]

- 즉, 저 `ex` 는 그냥 5byte 짜리 공간일 뿐이다. 이 공간을 `struct Example` 이라는 "지침서" 로 해석해서,
	- 처음의 4byte 는 `int` 자료형의 공간이고, `ex.integer` 라는 symbol 로 접근할수 있으며
	- 그 다음의 1byte 는 `char` 자료형의 공간이고 `ex.character` 라는 symbol 로 접근할 수 있다고 알려주는 것.

## Variant

- 그럼 이제 구조체를 사용하는 다양한 방법을 알아보자.

### Struct pointer

- 다른 변수들과 마찬가지로, 이놈도 pointer 에 동적할당해서 lifecycle 을 맘대로 제어할 수 있다.
- 다만, 이때는 각 필드에 접근할 때 `.` 가 아닌 `->` 연산자를 사용한다.
- 아래 예시를 보자.

```c {10}
#include <stdio.h>
#include <stdlib.h>

struct Example {
	int integer;
	char character;
};

int main() {
	struct Example* ex = malloc(sizeof(struct Example));
	ex->integer = 1;
	ex->character = 'A';

	printf("ex.integer: %d\n", ex->integer);
	printf("ex.character: %c\n", ex->character);

	free(ex);
}
```

![[Pasted image 20241001111603.png]]

- 별로 어렵지는 않죠?

### Typedef

- `typedef` 로 type alias 를 만들어서 매번 `struct` keyword 를 적어주는 불편함을 없앨 수 있다.

```c {4-7,10}
#include <stdio.h>
#include <stdlib.h>

typedef struct {
	int integer;
	char character;
} Example;

int main() {
	Example* ex = malloc(sizeof(Example));
	ex->integer = 1;
	ex->character = 'A';

	printf("ex.integer: %d\n", ex->integer);
	printf("ex.character: %c\n", ex->character);

	free(ex);
}
```

### (Kinda) Method

- OPP 에서의 method 가 욕심난다면, 이렇게 [[Function Pointer (C Type)|function pointer]] field 로 비슷하게 흉내낼 수 있긴 하다.

```c {9,15,18}
#include <stdio.h>

void print() {
	printf("Printing\n");
}

struct Example{
	int integer;
	void (*printer)();
};

int main() {
	struct Example ex;
	ex.integer = 1;
	ex.printer = &print;

	printf("ex.integer: %d\n", ex.integer);
	(*ex.printer)();
}
```

![[Pasted image 20241001113007.png]]