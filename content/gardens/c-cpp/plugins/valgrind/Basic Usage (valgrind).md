---
tags:
  - valgrind
date: 2024-12-29
aliases:
  - valgrind
---
> [!info]- 참고한 것들
> - [스댕 - 자세한 설명](https://stackoverflow.com/a/44989219)

> [!info]- 설치
> - `apt`
>
> ```bash
> sudo apt install -y valgrind
> ```

## 개요

- `valgrind` 는 메모리 검사 툴이다.
	- 가령 이놈으로 [[Memory Dynamic Allocation (C Memory)|malloc]] 등으로 할당한 메모리 공간을 추적하여 어디서 얼마나 memory leak 이 발생하는지 알아낼 수 있다.

### 기본 사용법

- 이놈을 사용하려면 일단 `gcc` 에 `-g` 옵션을 줘서 compile 해야 한다.
- 그리고 아래와 같이 하면 되니다.

```bash
valgrind \
	--leak-check=full \
	--show-leak-kinds=all \
	--track-origins=yes \
	--verbose \
	./executable
```

- 옵션들 간단하게 알아보면
	- `--leak-check=full`, `--show-leak-kinds=all`: Memory leak 에 대한 자세한 정보를 출력한다.
	- `--track-origins=yes`: 코드의 어느 위치에서 문제가 발생하는지를 backtrace 해준다.
		- 다만 이 옵션을 키게 되면 느려지므로 만약에 너무 오래걸리면 꺼도 된다.
	- `--verbose`: 추가적인 정보 출력