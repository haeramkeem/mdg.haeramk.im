---
tags:
  - c
date: 2024-10-02
aliases:
  - Function pointer
  - 함수 포인터
---
> [!info]- 참고한 것들
> - [스댕](https://stackoverflow.com/a/840504)
> - [긱](https://www.geeksforgeeks.org/function-pointer-in-c/)

## 누구냐 넌

- C 언어는 함수를 [[First, Second Class Citizen (PL)|Second-class citizen]] 으로 취급한다.
	- 즉, 함수를 "값" 으로 취급하지 않는다는 것.
- 만약 함수가 "값" 으로 취급된다면 그 값의 주소가 포인터가 될 것인데, C 언어는 그렇게 하지 않는다면 도대체 이 function pointer 는 어떤 놈일까?
- 이놈의 정체는 virtual memory 의 code 부분에 있는 함수의 주소를 가리키고 있는 변수이다.
	- 즉, 이것은 해당 포인터에는 메모리 공간을 [[C - 동적 할당 (malloc, calloc, free)|동적 할당]] 할 수 없다는 것.
- 예시를 보면서 살펴보자.

### 예시

- 아래는 간단한 function pointer 의 사용 예시이다.

```c
#include <stdio.h>

int sum(int a, int b) {
	return a + b;
}

int main() {
	int (*fn_ptr)(int, int) = sum;
	int res = fn_ptr(3, 4);
	printf("Sum: %d\n", res);
}
```

![[Pasted image 20241002095027.png]]

- 여기서 확인할 수 있는 function pointer 의 사용 방법은:
	- 일단 "함수의 이름" 은 function code 의 시작주소에 대한 named address 이다. 따라서 function pointer 에 함수의 이름을 넣어 해당 pointer 가 그 함수를 가리키게 할 수 있다.
		- 마치 배열 변수의 이름이 해당 배열의 시작 주소를 가리키는 named address 인 것과 유사하다.
	- 그리고 이 function pointer 의 자료형은 `(인자타입) -> 리턴타입` 으로 정의되는데, 이 자료형의 function pointer 변수를 선언하는 코드는 `리턴타입 (*변수명)(인자타입)` 으로 적는다.
	- 마지막으로 이 function pointer 는 일반 함수처럼 `()` 로 call 이 가능하다.
- 위와 같이 해도 아무런 문제가 없지만, "pointer" 라는 것을 더 확실하게 보여주기 위해 `&함수명` 으로 변수에 할당하고, `*함수명` 으로 호출하기도 한다.
- 즉, 다음과 같이 해도 아무런 문제가 없다는 것.

```c {8-9}
#include <stdio.h>

int sum(int a, int b) {
	return a + b;
}

int main() {
	int (*fn_ptr)(int, int) = &sum;
	int res = (*fn_ptr)(3, 4);
	printf("Sum: %d\n", res);
}
```

![[Pasted image 20241002095847.png]]

### First-class citizen 처럼 사용하기

- Function pointer 는 엄연한 "변수" 이기 때문에, [[First, Second Class Citizen (PL)|First-class citizen]] 처럼 사용할 수 있다.
- 즉, 다음과 같이 function pointer 를 인자로 주거나

```c {7-9}
#include <stdio.h>

int sum(int a, int b) {
	return a + b;
}

int caller(int (*arg)(int, int)) {
	return arg(2, 3);
}

int main() {
	printf("Sum: %d\n", caller(sum));
}
```

![[Pasted image 20241002100319.png]]

- Funtion pointer 를 리턴하는 것이 가능하다.

```c {7-9}
#include <stdio.h>

int sum(int a, int b) {
	return a + b;
}

int (*proxy())(int, int) {
	return sum;
}

int main() {
	printf("Sum: %d\n", proxy()(4, 5));
}
```

![[Pasted image 20241002100756.png]]

- Function pointer 를 return 할 때는 `type (*name(arg_type))(return_func_arg_type)` 같은 형식을 사용하게 되는데, 이것이 너무 복잡하다면 `typedef` 를 사용하면 된다.

```c {7-10}
#include <stdio.h>

int sum(int a, int b) {
	return a + b;
}

typedef int (*binaryop_t)(int, int);
binaryop_t proxy() {
	return sum;
}

int main() {
	printf("Sum: %d\n", proxy()(4, 5));
}
```

![[Pasted image 20241002101136.png]]