---
tags:
  - cmake
  - make
date: 2025-03-11
---
> [!info]- 참고한 것들
> - [스댕 - make](https://stackoverflow.com/a/5820364)
> - [스댕 - cmake (1)](https://stackoverflow.com/a/3379246)
> - [스댕 - cmake (2)](https://stackoverflow.com/a/61471216)

## TL;DR (Make)

- `make` 에서는 dry run option 인 `-n` 을 사용하면 된다.

```bash
make -n
```

## TL;DR (CMake)

- 우선 `-DCMAKE_VERBOSE_MAKEFILE=ON` 를 넣어서 `cmake` 를 해준다.
	- 보통 `cmake` 를 쓸 때 `build` 디렉토리를 만들어 그 안으로 들어가 사용하기 때문에, 저 `${PROJECT_ROOT}` 에 `..` 를 넣어주면 된다.

> [!tip]- `CMakeLists.txt` 에 넣으려면?
> ```cmake
> set(CMAKE_VERBOSE_MAKEFILE ON)
> ```

```bash
cmake -DCMAKE_VERBOSE_MAKEFILE=ON ${PROJECT_ROOT}
```

- 그리고 빌드를 하면
	- 보통 `${BUILD_DIR}` 는 `.` 를 넣어주면 된다.

```bash
cmake --build ${BUILD_DIR}
```

- 빌드를 하면서 그동안 표시되지 않았던 build command 들이 전부 표시된다.

## `compile_commands.json`

- Clangd 에 쑤셔넣기 위해 [[bear - 기본 사용법|compile_commands.json]] 를 뽑아내는 방법도 간단하게 정리

### Make

- 이거는 [[bear - 기본 사용법|bear]] 쓰자.

### CMake

- CMake 에서는 `-DCMAKE_EXPORT_COMPILE_COMMANDS=ON` 를 넣어서 `cmake` 를 하면 된다.

> [!tip]- `CMakeLists.txt` 에 넣으려면?
> ```cmake
> set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
> ```

```bash
cmake -DCMAKE_EXPORT_COMPILE_COMMANDS=ON ${PROJECT_ROOT}
```

- `compile_commands.json` 라는 파일이 만들어진다.
- 그리고 그 안에는 각 파일에 대한 compile option 들이 JSON 으로 다음과 같이 명시되어 있다.

```json
[
{
	"directory": "/path/to/directory",
	"command": "/usr/bin/cc   -O3 -DNDEBUG -std=gnu99 -Wall -Wextra -Wpedantic -Wmissing-prototypes -Werror -o /path/to/obj_file.c.o -c /path/to/source_file.c",
	"file": "/path/to/source_file.c",
	"output": "/path/to/obj_file.c.o"
},
...
]
```