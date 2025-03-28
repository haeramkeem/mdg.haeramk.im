---
tags:
  - c
date: 2025-03-28
aliases:
  - errno
---
## Error Global Variable

> [!tip] Header 파일
> - errno
> ```c
> #include <errno.h>
> ```
> - strerror()
> ```c
> #include <string.h>
> ```

- `errno` 는 에러 번호를 담는 global variable 이다.
	- 즉, 만약에 에러가 났다면 `errno` 에 에러 번호가 담기게 되고, 이 변수는 (global 이기 때문에) 별도의 선언 없이 사용할 수 있다.
- 그리고 `strerror()` 함수를 이용해 errno 를 문자열로 바꿔줄 수 있다.
- 다음의 예시를 보시라.

```c
#include <stdio.h>
#include <fcntl.h>
#include <errno.h>
#include <string.h>

int main(void)
{
	int fd = open(file: "not-exist-file", oflag: O_RDONLY, 0644);
	if (fd < 0)
	{
		printf(format: "Errno: %d, message: '%s'\n", errno, strerror(errnum: errno));
	}
}
```

- 위 예시에서는 `"not-exist-file"` 라는 존재하지 않는 파일을 open 하려고 하는 모습이다.
- 따라서 이때는 당연히 음수 `fd` 가 반환되고, 이때의 `errno` 와 error message 를 출력해보면 다음과 같다.

![[Pasted image 20250328162037.png]]

- 위에서 확인할 수 있다시피, 2 번은 `ENOENT` 로서 파일이 존재하지 않는다는 것을 의미한다.
- 각 번호가 어떤것인지는 bash 에서 `errno` 명령어로 확인해 볼 수 있다.
	- 귀찮다면, [이 링크](https://gist.github.com/greggyNapalm/2413028) 에서도 볼 수 있다.

```bash
errno -l
```