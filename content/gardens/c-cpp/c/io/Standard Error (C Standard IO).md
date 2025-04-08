---
tags:
  - c
  - c-io
date: 2025-04-08
aliases:
  - stderr
---
> [!info]- 참고한 것들
> - [스댕](https://stackoverflow.com/a/1716621)

## TL;DR

- 에러메세지를 출력하기 위해 표준에러(stderr) 로 출력하기 위해서는 다음과 같이 하면 된다.

```c
fprintf(stderr, "Message", ...)
```

- `fprintf` 는 특정 stream 으로 메세지를 보내는 함수이다.
	- 따라서 당연히 `fprintf(stdout)` 도 가능하다. 근데 `printf` 를 쓰지 굳이 이렇게 할 이유는 없다.
- 그리고 `stderr` stream 은 buffering 되지 않는다. 따라서 추가적으로 buffer 를 flush 해줄 필요는 없다.