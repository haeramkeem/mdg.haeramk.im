---
tags:
  - cpp
  - cpp-class
date: 2024-07-12
---
> [!info]- 참고한 것들
> - [공문](https://en.cppreference.com/w/cpp/language/copy_constructor)

## 코드 예시

- *Copy constructor* (*복사 생성자*) 는 기존의 object 를 copy 하는 방식으로 새로운 object 를 생성할 때 호출되는 생성자이다.
	- 참고로, `ClassName new_obj_name(copied_from)` 의 형태가 "기존의 object 를 copy 하는 방식으로 새로운 object 를 생성" 하는 문법이다.

```cpp {9, 12-15}
#include <iostream>
#include <string>

class Example {
private:
	std::string name_;
public:
	Example(std::string name) : name_(name) {}
	Example(Example& other);
};

Example::Example(Example& other) : name_(other.name_ + "_copied") {
	std::cout << "Copy constructor called: this(" << this->name_ <<
		"), other(" << other.name_ << ")" << std::endl;
}

int main() {
	Example ex("ex");
	Example ex_cp(ex);
}
```

```
Copy constructor called: this(ex_copied), other(ex)
```

- 위 예제에서 보다시피, copy constructor 에서 copy 된 놈은 이름 뒤에 `"_copied"` 를 붙이도록 되어 있고, 따라서 `ex_cp` object 의 이름이 `"ex_copied"` 가 된다.
- Copy constructor 는 문법은 [[Cpp - class Constructor, 생성자|constructor]] 와 유사하지만, 인자는 "반드시":
	- 동 class 에 대한
	- [[Cpp - Reference 타입|Reference type]] 이어야 한다.