---
tags:
  - c
  - linux-kernel
date: 2025-03-13
---
> [!info]- 참고한 것들

## 시간 알아내기

- Linux kernel 내에서 시간을 알아내기 위한 방법이 몇가지 있는데, 하나하나 알아보자.

## `ktime`

> [!tip] Header
> ```c
> #include <linux/ktime.h>
> ```

- Linux kernel code 에서 timestamp 를 찍는 가장 간단한 방법이다.
- `ktime_get()` 함수는 timestamp 를 nanosecond 값인 `ktime_t` 형으로 반환한다.

```c
ktime_t nano = ktime_get();
ktime_t micro = ktime_get() / 1000;
ktime_t milli = ktime_get() / 1000 / 1000;
```