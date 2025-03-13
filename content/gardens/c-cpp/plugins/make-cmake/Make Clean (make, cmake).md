---
tags:
  - make
  - cmake
date: 2025-03-11
---
> [!info]- 참고한 것들
> - [스댕 - CMake](https://stackoverflow.com/a/9680493)

## TL;DR

- 보통은 build cache 를 날리는 등의 목적을 위해 `make clean` target 을 만들어 놓는다.

```make
clean:
	rm -f *.o $(TARGET)
```

- CMake 에서는 이런 target 을 기본적으로 제공한다. 별다른 설정 없이도, 다음의 명령어로 build cache 들을 날려줄 수 있다.
	- 보통 `build` 디렉토리를 만들어 그 안에 들어가 작업하므로 `${BUILD_DIR}` 은 `.` 로 하면 된다.

```bash
cmake --build ${BUILD_DIR} --target clean
```