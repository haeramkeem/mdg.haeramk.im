---
tags:
  - c
  - c-io
date: 2025-04-08
aliases:
  - open
---
> [!info]- 참고한 것들
> - [Man7](https://man7.org/linux/man-pages/man2/open.2.html)
> - [스댕](https://stackoverflow.com/a/35768412)

## TL;DR

> [!tip] Header 정보
> ```c
> #include <fcntl.h>
> ```

- 간단하게 말하면 파일을 열고 file descriptor 를 반환한다.

```c
int fd = open("file_path", options, 0644);
```

- 우선 첫번째 인자로 파일 경로, 두번째는 옵션, 세번째는 권한이 들어간다.
	- 여기서 권한은 그냥 linux permission 이다. 잘 모르겠으면 `0644` (RW-R-R) 를 넣으면 된다.

## Options

- 흔히 사용하는 옵션들만 몇개 알아보자. 여러개의 옵션을 사용할 때에는 OR (`|`) 로 묶으면 된다. 별일 없으면 아래처럼 옵션을 주면 된다.

```c
O_RDWR | O_CREAT
```

- 추가적으로 이런애들이 있다:
	- `O_RDWR`: 그냥 읽기, 쓰기가 가능한 옵션.
	- `O_RDONLY`: 읽기 전용 (read only).
	- `O_WRONLY`: 쓰기 전용 (write only).
	- `O_CREAT`: 만약에 파일이 없으면 생성한다.
	- `O_DIRECT`: Linux page cache 를 사용하지 않고 [[Direct IO, O_DIRECT (C File IO)|Direct IO]] 를 사용한다.
	- `O_SYNC`: Synchronize IO 를 한다. 즉, [[Write System Call (C File IO)|write]] 할 때 실제로 disk 에 데이터가 쓰일때까지 함수가 return 되지 않는다.