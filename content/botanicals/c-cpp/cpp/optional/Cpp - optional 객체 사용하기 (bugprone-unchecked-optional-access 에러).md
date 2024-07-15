---
tags:
  - cpp
  - cpp-optional
date: 2024-07-12
---
> [!info]- 참고한 것들
> - [Clang](https://clang.llvm.org/extra/clang-tidy/checks/bugprone/unchecked-optional-access.html)

## TL;DR

```cpp {5-8}
#include <iostream>
#include <optional>

void print(std::optional<std::string> str) {
	if (str.has_value()) {
		std::cout << "Using 'value()': " << str.value() << std::endl;
		std::cout << "Using '*': " << *str << std::endl;
		std::cout << "Func call: " << str->size() << std::endl;
	} else {
		std::cout << "nullopt" << std::endl;
	}
}

int main() {
	std::optional<std::string> opt1 = "opt1";
	std::optional<std::string> opt2 = std::nullopt;
	print(opt1);
	print(opt2);
}
```

```
Using 'value()': opt1
Using '*': opt1
Func call: 4
nullopt
```

## 설명

- `std::optional` 은 pointer 처럼 `*` 와 `->` 연산자를 지원한다.
	- 즉, `*` 를 사용하게 되면 optional 에 감싸져 있던 원래 값을 꺼내게 되고,
	- `->` 를 사용하면 원래 값에 대한 member function 들을 호출하게 된다.
- 이것 외에도 `*` 와 동일한 기능을 제공하는 `std::optional::value()` 가 있다.
- 근데 주의할 것은 이것들을 그냥 사용할 수는 없고, "반드시" `std::optional::has_value()` 로 값이 존재하는지 검사한 후에 위와 같은 연산을 사용해야 한다.
	- 이 함수로 검사를 하지 않고 사용하게 되면 `bugprone-unchecked-optional-access` 에러가 나게 된다
		- 즉, 이 에러는 검사 과정 없이 `*`, `->`, `std::optional::value()` 셋 중 하나를 사용했다는 에러문구인 것.