---
tags:
  - cpp
  - cpp-smart-pointer
date: 2024-07-01
---
## TL;DR

```cpp {17}
#include <iostream>
#include <memory>

class Example {
public:
	auto Print() -> void { std::cout << "Example" << std::endl; }
};

int main() {
	// Copy constructor 를 사용하면 두 포인터가 동일하다
	auto original = std::make_shared<Example>();
	auto copied = std::shared_ptr<Example>(original);
	// 즉, 이건 참이어라
	std::cout << std::boolalpha << (original == copied) << std::endl;

	// 하지만 Move constructor 를 사용하면 달라지게 된다
	auto moved = std::move(original);
	// 즉, 이건 거짓이지만
	std::cout << std::boolalpha << (original == copied) << std::endl;
	// 이건 참이어라
	std::cout << std::boolalpha << (copied == moved) << std::endl;
	// 조심할 것은 그래도 `original` 이 `nullptr` 가 되지는 않는다;
	// 그냥 다른 오브젝트로 분리되는 것
}
```

- `shared_ptr` 에서 그냥 copy constructor 를 사용하는 것 보다 `move` 를 사용하면 더 빠르다고 한다.
	- 당연히 `shared_ptr` 에서의 copy constructor 는 atomic 하게 reference counter 를 증가시켜야 하기 때문에 다소 느려지기 때문 ([출처일세](https://stackoverflow.com/a/41874953))