---
tags:
  - cpp
  - cpp-class
date: 2024-07-12
---
> [!info]- 참고한 것들
> - [공문](https://en.cppreference.com/w/cpp/language/move_constructor)

## 코드 예제

- *Move constructor* (*이동 생성자*) 는 [[Cpp - 소유권 (move)|move]] 시에 호출되는 생성자이다.
- 아래 예시를 보자.

```cpp {9, 13-16}
#include <iostream>
#include <string>

class Example {
private:
	std::string name_;
public:
	Example(std::string name) : name_(name) {}
	Example(Example&& other);
	inline auto Name() -> std::string { return this->name_; }
};

Example::Example(Example&& other) : name_(std::move(other.name_) + "_moved") {
	std::cout << "Move constructor called: this(" << this->name_ <<
		"), other(" << other.name_ << ")" << std::endl;
}

void print(Example ex) {
	std::cout << ex.Name() << std::endl;
}

int main() {
	Example ex("ex");
	// Example ex1 = ex;
	print(std::move(ex));
}
```

```
Move constructor called: this(ex_moved), other()
ex_moved
```

- 위 예시는 `"{{ move 당한놈의 이름 }}_moved"` 로 이름을 바꾸며 move 를 하는 것이다.
- 보다시피 기본 문법은
	- [[Cpp - class Constructor, 생성자|일반 생성자]] 와 유사하나
	- 동 class object 를 인자로 하되, `&&` 타입으로 선언해야만 한다.
	- 다만 default parameter 는 받을 수 있다고 한다.
- 주의할 점은:
	- [[Cpp - class Constructor, 생성자#Member Initializer List|Member initializer list]] 를 사용할 때 소유권이 넘어갈 수 있음을 고려해야 한다는 것이다.
		- 예시에서 `other.name_` 이 출력되지 않는 것은 [[Cpp - class Constructor, 생성자#Member Initializer List|member initializer list]] 에서 `std::move(other.name_)` 를 호출하며 `other.name_` 에 대한 소유권이 날아갔기 때문이다.
	- Move constructor 가 선언되어 있으면 default [[Cpp - class Copy constructor, 복사 생성자|copy constructor]] 와 [[Cpp - class Copy assignment operator, 복사 대입 연산자|copy assignment operator]] 가 "암묵적으로" 삭제된다는 것이다.
		- 따라서 위 예제에서 주석처리된 24번째 줄은 주석 해제시 컴파일 에러가 난다.

```
move_constructor.cc:23:9: error: call to implicitly-deleted copy constructor of 'Example'
Example ex1 = ex;
        ^     ~~
move_constructor.cc:9:1: note: copy constructor is implicitly deleted because 'Example' has a user-declared move constructor
Example(Example&& other);
^
1 error generated.
```