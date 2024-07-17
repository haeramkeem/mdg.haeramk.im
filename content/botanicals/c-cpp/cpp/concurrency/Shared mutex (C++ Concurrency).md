---
tags:
  - cpp
  - cpp-concurrency
  - cpp-mutex
date: 2024-07-17
---
> [!info]- 참고한 것들
> - [공문](https://en.cppreference.com/w/cpp/thread/shared_mutex)

## 란?

- Lock 은 두 종류로 나눠볼 수 있다:
	- *Shared lock*: 여러번 걸 수 있는 lock
	- *Exclusive lock*: 한번만 걸 수 있는 lock
- 그럼 *Shared lock* 이 왜 필요할까. 사실 *Shared lock* 만 존재하면 lock 을 하지 않는 것이나 다름없는데도 말이다.
	- *Shared lock* 이 존재하는 이유는 *Exclusive lock* 이 있기 때문이다.
	- *Shared lock* 이 걸려있으면 *Exclusive lock* 을 걸 수 없고, 그 반대도 마찬가지이다.
	- 즉, (1) lock 이 안걸려 있는 상황, (2) *Shared lock* 이 걸려있는 상황, (3) *Exclusive lock* 이 걸려 있는 상황 세 경우는 모두 배타적인 것이라고 할 수 있는 것.
- 이것을 사용하는 것은 Read, Write lock 의 예시를 들 수 있다.
	- Read lock 을 *Shared lock* 으로 관리하고, Write lock 을 *Exclusive lock* 으로 관리하면:
	- 여러 client 가 read 를 하는 상황에서, write 는 발생하지 않게 막을 수 있고,
	- 반대로 write 가 수행되는 중에는, 어느 client 도 read 할 수 없게 막을 수 있다.

## 예시

```cpp
#include <iostream>
#include <shared_mutex>

int main() {
	std::shared_mutex m;

	m.lock_shared();

	std::cout << "[1] " << std::boolalpha << m.try_lock() << std::endl;
	std::cout << "[2] " << std::boolalpha << m.try_lock_shared() << std::endl;

	m.unlock_shared();
	m.unlock_shared();

	m.lock();

	std::cout << "[3] " << std::boolalpha << m.try_lock() << std::endl;
	std::cout << "[4] " << std::boolalpha << m.try_lock_shared() << std::endl;

	m.unlock();
}
```

```
[1] false
[2] true
[3] false
[4] false
```

- 간단히 설명해 보면,
	- `[1]` 는 *Shared lock* 이 걸린 상황에서, 또 다른 *Shared lock* 을 거는 경우이다. 당연히 가능하다 (`true`).
	- `[2]` 는 *Shared lock* 이 걸린 상황에서, *Exclusive lock* 을 거는 것이다. 불가능하다 (`false`).
	- `[3]` 은 *Exclusive lock* 이 걸린 상황에서, 또 다른 *Exclusive lock* 을 거는 것이다. 당연히 불가능하다 (`false`).
	- `[4]` 은 *Exclusive lock* 이 걸린 상황에서, *Shared lock* 을 거는 경우이다. 이것도 불가능하다 (`false`).