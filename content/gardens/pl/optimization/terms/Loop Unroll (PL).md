---
tags:
  - pl
  - pl-optimization
  - terms
date: 2024-09-02
aliases:
  - Loop Unroll
---
> [!info]- 참고한 것들
> - [[16. Analysis & Optimization#1. Loop Unrolling|충남대 조은선 교수님 컴파일러 강의 (Fall 2021)]]

## 란?

- *Unroll*, 즉 말려져있는 것을 편다는 의미인데
- 여기서서는 loop 을 도는 것을 *roll*, 도는 것이 아닌 쭉 sequential 하게 실행하는 것을 *unroll* 이라고 생각하면 된다.
- 바로 다음과 같은 상태가 *roll* 이라고 생각하면 된다.

```c
for (int i = 0; i < MAX; i++) {
	do_something(arr[i]);
}
```

- 그리고 이것을 (부분적으로) *unroll* 한 것은 다음과 같다고 할 수 있다:

```c
for (int i = 0; i < MAX; i += 4) {
	do_something(arr[i]);
	do_something(arr[i+1]);
	do_something(arr[i+2]);
	do_something(arr[i+3]);
}
```

- 이렇게 하는 식으로 loop 횟수를 줄일 수 있다.