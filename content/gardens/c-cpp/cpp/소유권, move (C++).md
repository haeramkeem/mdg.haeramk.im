---
tags:
  - cpp
  - cpp-smart-pointer
date: 2024-07-01
---
## TL;DR

- Cpp 에는 "소유" 라는 개념이 있고, `std::move` 함수로 이 소유권을 변경할 수 있다.
- 다음의 예시로 살펴보자 [^comment].

```cpp {18}
#include <iostream>
#include <memory>

class Example {
public:
	auto Print() -> void { std::cout << "Example" << std::endl; }
};

int main() {
	// Smart pointer 의 Copy constructor 를 사용하면 두 포인터가 동일하다.
	auto original = std::make_shared<Example>();
	auto copied = std::shared_ptr<Example>(original);

	// 즉, 이건 참이어라.
	std::cout << std::boolalpha << (original == copied) << std::endl;

	// 하지만 Move constructor 를 사용하면 달라지게 된다.
	auto moved = std::move(original);

	// 즉, 이건 거짓이지만,
	std::cout << std::boolalpha << (original == copied) << std::endl;

	// 이건 참이어라.
	std::cout << std::boolalpha << (copied == moved) << std::endl;

	// 조심할 것은 그래도 `original` 이 `nullptr` 가 되지는 않는다;
	// 그냥 다른 오브젝트로 분리되는 것
}
```

```
true
false
true
```

- `shared_ptr` 에서 그냥 copy constructor 를 사용하는 것 보다 `move` 를 사용하면 더 빠르다고 한다.
	- 당연히 `shared_ptr` 에서의 copy constructor 는 atomic 하게 reference counter 를 증가시켜야 하기 때문에 다소 느려지기 때문 ([출처일세](https://stackoverflow.com/a/41874953))
---
[^comment]: 내용과는 아무런 연관이 없는 넋두리이긴 하지만, 이럴 때 보면 [Go by example](https://gobyexample.com/) 처럼 주석이 아니라 코드 옆에 나란히 보여주는 디자인이 부럽다.