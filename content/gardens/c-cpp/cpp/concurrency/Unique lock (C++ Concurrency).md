---
tags:
  - cpp
  - cpp-concurrency
  - cpp-mutex
date: 2024-07-17
---
> [!info]- 참고한 것들
> - [공문](https://en.cppreference.com/w/cpp/thread/unique_lock)
> - [공문 (Lock tag)](https://en.cppreference.com/w/cpp/thread/lock_tag)
> - [어떤 블로그](https://dydtjr1128.github.io/cpp/2020/04/05/Cpp-lock.html)

## 란?

- [[Lock guard (C++ Concurrency)|std::lock_guard]] 와 유사하게 scope 내에서만 lock 을 잡지만,
- 여기에다가 추가적인 기능까지 제공해주는 general purpose mutex 이다.

### Lock tag

- *Unique lock* 에서는 lock 을 언제 잡는지를 설정해 줄 수 있다.
- 다음과 같은 것이 있다:
	- `std::defer_lock`: Unique lock 생성시에 lock 을 잡지 않음.
	- `std::try_to_lock`: Unique lock 생성시에 lock 을 잡아 보고, 안되면 뭐 어쩔 수 없지
	- `std::adopt_lock`: Lock 이 이미 잡혀있다고 가정하는 것이다.
		- `std::try_to_lock` 의 경우에는 unique lock 생성시에 lock 이 잡히지 않으면 해당 lock 의 lifecycle 은 unique lock 이 관리하지 않는다.
			- 즉, unique lock 이 소멸되어도 lock 이 풀리리라는 보장은 없다는 것.
		- 하지만, `std::adopt_lock` 의 경우에는 unique lock 생성시에 lock 이 잡히지 않아도 lifecycle 은 unique lock 이 관리한다.
			- 즉, "관리주체 이전" 의 개념이라고 보면 되고, unique lock 이 소멸되면 lock 은 풀리게 된다.

## 코드 예시

```cpp
#include <iostream>
#include <mutex>

int main() {
	std::mutex m;
	{
		std::unique_lock<std::mutex> l(m);
		std::cout << "[1] " << std::boolalpha << l.owns_lock() << std::endl;
	}
	{
		std::unique_lock<std::mutex> dl(m, std::defer_lock);
		std::cout << "[2] " << std::boolalpha << dl.owns_lock() << std::endl;
		dl.lock();
		std::cout << "[3] " << std::boolalpha << dl.owns_lock() << std::endl;
	}
	m.lock();
	{
		std::unique_lock<std::mutex> ttl(m, std::try_to_lock);
		std::cout << "[4] " << std::boolalpha << ttl.owns_lock();
	}
	std::cout << " " << std::boolalpha << m.try_lock() << std::endl;
	{
		std::unique_lock<std::mutex> al(m, std::adopt_lock);
		std::cout << "[5] " << std::boolalpha << al.owns_lock();
	}
	std::cout << " " << std::boolalpha << m.try_lock() << std::endl;
	m.unlock();
}
```

```
[1] true
[2] false
[3] true
[4] false false
[5] true true
```

- 위에서 말한 그대로이다:
	- `[1]`: Unique lock 은 기본적으로 생성시에 lock 을 잡는다.
	- `[2]`: `defer_lock` 모드일 때는 생성시에 lock 을 잡지 않는다.
	- `[3]`: `defer_lock` 모드를 사용할 때에는, 수동으로 lock 을 잡아야 한다.
	- `[4]`: `try_to_lock` 모드를 사용하면, 기존에 lock 이 걸린 경우 Unique lock 은 실패하고, lock cycle 을 unique lock 이 관리하지 않는다.
		- 따라서 첫 `false` 는 `ttl` 이 lock 을 소유하고 있지 않다는 의미이고,
		- 두번째 `false` 는 `ttl` 이 lock cycle 을 관리하지 않아 block 을 벗어난 다음에도 lock 이 풀리지 않아 `try_lock()` 이 실패하였다는 의미이다.
	- `[5]`: 반면에 `adopt_lock` 모드의 경우에는 기존에 lock 이 걸려있었으면 lifecycle 을 가져온다.
		- 따라서 첫 `true` 는 unique lock 이 해당 lock 을 소유하고 있다는 의미인 것이고,
		- 두번째 `true` 는 `al` 이 소멸되자 lock 이 풀려 새로 lock 이 가능하다는 의미이다.