---
tags:
  - gdb
date: 2024-12-16
---
> [!info]- 참고한 것들
> - [스댕 - thread 정보](https://stackoverflow.com/a/43007396)
> - [스댕 - scheduler-locking](https://stackoverflow.com/a/44285363)

## TL;DR

### Thread 정보 확인

```bash
thread
```

### 한 thread 에서만 debugging

```bash
set scheduler-locking step
```