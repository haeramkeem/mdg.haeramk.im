---
tags:
  - cpp
  - cpp-concurrency
  - cpp-mutex
date: 2024-07-17
---
> [!warning]- 본 글은 #draft 상태입니다.
> - [ ] 데드락 예시 추가

## 왜?

```cpp title="문법"
std::lock(mutex_1_, mutex_2_);
```

- [[Mutex (C++ Concurrency)|Mutex]] 를 사용하다 보면, 여러개를 한번에 걸어야 할 때가 있다.
- 근데 이 상황에서, 데드락이 걸릴 수도 있다.
	- #draft 데드락이 걸리는 예시도 같이 적으면 좋겠지만, 우선은 그냥 넘어가자.
- 따라서 여러개의 lock 을 atomic 하게 걸 수 있으면 행복할 것이고, 이 기능을 해주는 것이 `std::lock()` 이다.