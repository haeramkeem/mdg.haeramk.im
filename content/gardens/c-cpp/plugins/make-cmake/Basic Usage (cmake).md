---
tags:
  - c-cpp
  - c-cpp-cmake
aliases:
  - cmake
date: 2025-02-24
---
## TL;DR

- C 코드는 `src/` 에 넣고 header 는 `src/include/` 에 넣는다고 했을 때

```cmake
cmake_minimum_required(VERSION 3.10)

project(프로젝트_이름)

set(CMAKE_C_STANDARD 99)
set(CMAKE_C_STANDARD_REQUIRED True)

# Additional options...
# e.g. set(CMAKE_BUILD_TYPE Debug)

FILE(GLOB_RECURSE SRC
  ${CMAKE_SOURCE_DIR}/src/*.c
)

include_directories(
    ${CMAKE_SOURCE_DIR}/src/include
)

add_executable(${CMAKE_PROJECT_NAME} ${SRC})

# Link libraries...
# e.g. target_link_libraries(${CMAKE_PROJECT_NAME} PRIVATE m)

target_compile_options(${CMAKE_PROJECT_NAME} PRIVATE
	-Wall -Wextra -Wpedantic -Wmissing-prototypes -Werror
)
```

- 이렇게 기본 틀을 잡고 우선 디렉토리를 하나 (보통 `build` 으로 이름짓는다) 생성해 들어간 다음

```bash
mkdir build && cd build
```

- `cmake` 로 Makefile 을 생성해주고

```bash
cmake ..
```

- 빌드해주면 된다.

```bash
cmake --build .
```