---
tags:
  - c
  - c-utils
date: 2025-06-26
---
> [!info]- 참고한 것들
> - [스댕](https://stackoverflow.com/a/5157549)

## TL;DR

- 살다 보면 command line argument 를 써야 되는 순간이 올 수도 있다.
- 그럼 `main` 함수를 아래와 같이 선언하면 된다

```c
int main(int arg_count, char **arg_list)
```

- 예를들어 이렇게 하면

```c
#include <stdio.h>

int main(int arg_count, char **arg_list)
{
	for (int i = 0; i < arg_count; i++)
	{
		printf("Arg %d is %s\n", i, arg_list[i]);
	}
}
```

- 요래 출력이 된다.

![[Pasted image 20250626003046.png]]

- 보다시피 index 0 은 무조건 실행파일 이름인 것을 알 수 있다.