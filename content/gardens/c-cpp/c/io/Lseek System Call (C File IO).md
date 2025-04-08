---
tags:
  - c
  - c-io
date: 2025-04-08
aliases:
  - lseek
---
## TL;DR

> [!tip] Header 정보
> ```c
> #include <unistd.h>
> ```

- `lseek` 는 file 의 커서를 움직이고 현재 커서 위치를 반환하는 함수이다.

```c
off_t current_offset = lseek(fd, offset, whence);
```

- 일단 사용법은
	- 저 `whence` 로 기준점은 설정한다. 여기에는 세 옵션이 있다:
	- `SEEK_SET`: 파일의 시작점을 기준으로 `offset` 만큼 뒤에 커서를 둔다.
	- `SEEK_CUR`: 현재 커서 위치를 기준으로 `offset` 만큼 뒤에 커서를 둔다.
	- `SEEK_END`: 파일의 끝을 기준으로 `offset` 만큼 뒤에 커서를 둔다.

## File Size 구하기

- 이 함수는 커서를 옮기는 용도 외에 파일 사이즈를 알아내는 용도로도 많이 사용된다.
- 아래처럼 하면 된다.

```c
size_t file_size = lseek(fd, 0, SEEK_END);
```

- 즉, `SEEK_END` 로 파일 맨 끝을 기준으로 해서 `offset` 을 0으로 주면 return 값인 현재 위치가 곧 파일 사이즈가 되는 것.