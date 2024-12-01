---
tags:
  - cmake
  - c-cpp
date: 2024-12-01
---
> [!info]- 참고한 것들
> - [스댕](https://stackoverflow.com/a/52441210)

## `pkg-config` 를 이용한 `cmake` 에 library 설정하기

- Library 를 `cmake` 에 설정해 C, C++ 코드에서 사용할 수 있도록 해보자.
	- 예시로 [glib](https://docs.gtk.org/glib/) 를 주입해보자.
- 일단 원하는 library 를 `pkg-config` 로 찾을 수 있는지 확인해 본다.

```bash
pkg-config --cflags --libs glib-2.0
```

![[Pasted image 20241201161928.png]]

- 이런식으로 `gcc` flag 들이 잘 나온다면, 다음과 `cmake` 를 작성하면 된다.

```cmake
# ... add_executable() 이후

find_package(PkgConfig REQUIRED)
pkg_check_modules(GLIB REQUIRED IMPORTED_TARGET glib-2.0)
target_link_libraries(${CMAKE_PROJECT_NAME} PkgConfig::GLIB)
```