---
tags:
  - cpp
  - cpp-mutex
date: 2024-07-03
---
## TL;DR

- Thread 를 사용하는 예제까지 적어놓으면 좋겠지만, 일단

```cpp
#include <iostream>
#include <mutex>

int shared;

int main() {
	std::mutex m;

	// 이름이 시사하는 것처럼, `lock()` 는 lock 을 잡는 함수다.
	// 만약 누군가가 lock 을 이미 잡았다면, 그것을 놓아줄 때 까지 기다리게 된다.
	m.lock();
	shared = 123;

	// 잡은 lock 을 놓는 것
	m.unlock();

	// 얘는 `lock()` 과 다르게 lock 을 잡지 못해도 기다리지 않고 바로 return 된다.
	// 만약 잡았다면 true 를, 못잡았다면 false 를 반환한다.
	if (m.try_lock()) {
		std::cout << "Lock acquired" << std::endl;
		m.unlock();
	} else {
		std::cout << "Cannot acquire lock" << std::endl;
	}
}
```