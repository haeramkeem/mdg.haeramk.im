---
tags:
  - lldb
  - cmake
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