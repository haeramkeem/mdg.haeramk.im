---
tags:
  - cmake
  - make
  - c-cpp
  - c-cpp-preprocess
date: 2024-11-18
---
> [!info]- 참고한 것들
> - [스댕 - make](https://stackoverflow.com/a/9052935)
> - [스댕 - cmake](https://stackoverflow.com/a/10364240)

## `#define` 주입하기

- Compile time 에 `#define` (macro) 를 주입하고 싶다면, 이렇게 하면 된다.
- 우선 `make` 에서는:

```bash
make CFLAGS=-Dkey=value
```

- 그리고 `cmake` 에서는:

```bash
cmake -Dkey=value
```