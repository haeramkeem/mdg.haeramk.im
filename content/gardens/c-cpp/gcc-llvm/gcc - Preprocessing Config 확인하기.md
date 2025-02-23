---
tags:
  - gcc
date: 2025-02-17
---
## 이걸 왜?

- 가끔 library 를 사용하려고 할 때 header file 을 찾지 못해 컴파일이 안되는 경우가 있다.
- 이때, 지금의 [[Compilation Steps (GCC, LLVM)|Preprocessing]] 설정을 확인하여 어디에서 header file 을 찾는지 알아내면 에러의 실마리를 얻을 수 있다.

## TL;DR

```bash
cpp -v /dev/null
```

- 여기서 `cpp` 는 C++ 가 아니고 C Pre-Processor 의 약자인듯 하다.
- 이렇게 치면 여러 값들이 나오는데, 여기서 다음 부분을 찾으면 된다.

![[Pasted image 20250217185357.png]]