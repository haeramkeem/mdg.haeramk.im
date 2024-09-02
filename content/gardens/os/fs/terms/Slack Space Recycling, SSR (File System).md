---
tags:
  - terms
  - os-fs
date: 2024-03-27
---
> [!info] 참고한 문서
> - [성균관대 논문](http://nyx.skku.ac.kr/publications/papers/04_partial_GC.pdf)

## 이게 뭐지

- 이것은 [[Log-structured File System, LFS (File System)|LFS]] 의 [[Garbage Collection, GC (Storage)|GC]] 오버헤드를 줄이기 위해 등장한 것으로, free space 가 부족할 때 GC 를 하지 않고 LFS 의 dirty segment 에 기록해 GC 를 지연시키는 방법이다.
- 하지만 이것을 계속 사용하면 작은 크기의 free space 가 많아져서 random write 가 필요해 지는 문제가 있다고 한다 [^cons].

[^cons]: 논문에서는 그렇다고 하는데, 왜 그런지는 모르겠다. 더 찾아보면 이해되겠지만 일단 지금은 패스