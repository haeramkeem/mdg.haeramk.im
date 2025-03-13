---
tags:
  - cmake
  - gdb
  - lldb
date: 2024-07-02
---
## TL;DR

- `cmake` 에는 다음처럼 설정해주면 자동으로 알맞게 Makefile 이 생성된다.
- `CMakeLists.txt` 에 다음처럼 적어주던가

```cmake
set(CMAKE_BUILD_TYPE Debug)
```

- 아니면 인자로 넣어주면 되니라

```sh
cmake -DCMAKE_BUILD_TYPE=Debug ${경로}
```

- 그리고 다음 명령어로 세션을 열어주면 된다

```sh
lldb ${경로}
```

```sh
gdb ${경로}
```

## Tip

- Debug mode 일 때만 특정 compile option 을 주기 위해서는, `CMAKE_CXX_FLAGS_DEBUG` 를 사용하면 된다.
- 가령 다음과 같이 해줄 수 있다.

```cmake
set(CMAKE_CXX_FLAGS_DEBUG "-g")
```