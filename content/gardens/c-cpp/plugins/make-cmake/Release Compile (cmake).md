---
tags:
  - cmake
date: 2025-03-13
---
> [!info]- 참고한 것들
> - [스댕](https://stackoverflow.com/a/41361741)

## TL;DR

- [[Basic Usage (cmake)|cmake]] 에서 build type 기본값을 release 로 하고 release mode 일 때 GCC optimize option 을 키기 위해서는 다음과 같이 하면 된다.

```cmake
if(NOT CMAKE_BUILD_TYPE)
  set(CMAKE_BUILD_TYPE Release)
endif()

set(CMAKE_CXX_FLAGS_RELEASE "-O3")
```

- 인자로 넣으려면, 다음과 같이 한다.

```sh
cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_CXX_FLAGS_RELEASE=-O3 ${경로}
```