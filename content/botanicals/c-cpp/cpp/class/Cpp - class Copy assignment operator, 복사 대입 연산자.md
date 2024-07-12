---
tags:
  - cpp
  - cpp-class
date: 2024-07-12
---
> [!info]- 참고한 것들
> - [공문](https://en.cppreference.com/w/cpp/language/copy_assignment)

## 코드 예시

- *Copy assignment operator* (*복사 대입 연산자*) 는 이름은 거창하지만, 그냥 `=` 이다.
- 다만 C++ 에서는 이 `=` 를 사용할 때의 작동 과정을 명시할 수 있다는 것.
- 아래 코드를 보자.

```cpp {9, 13-18}
#include <iostream>
#include <string>

class Example {
private:
	std::string name_;
public:
	Example(std::string name) : name_(name) {}
	Example& operator=(Example& other);
	inline void Print() { std::cout << this->name_ << std::endl; }
};

Example& Example::operator=(Example& other) {
	std::cout << "Copy assignment operator called: this(" << this->name_ <<
		"), other(" << other.name_ << ")" << std::endl;
	this->name_ += "_from_" + other.name_;
	return *this;
}

int main() {
	Example ex1("ex1");
	Example ex2("ex2");
	ex2 = ex1;
	ex2.Print();
}
```

```
Copy assignment operator called: this(ex2), other(ex1)
ex2_from_ex1
```

- 위 예제는 copy assignment 된 객체는 `"{{ 원래 이름 }}_from_{{ 상대방 이름 }}"` 으로 이름이 변경되도록 한 것이다.
- 보다시피, 선언은 `ClassName operator=(ClassName var_name)` 형태이다.
	- 즉, 동 class object 를 받아 동 class object 를 반환하고
	- 함수 이름은 `operator=` 이어야 한다.
	- 동 class object 는 value type 도 되고 [[Cpp - Reference 타입|reference type]] 도 된다.
	- 다만, 인자는 `const` 타입이면 안된다고 한다.

## Copy construct 와 Copy assignment operator

- 주의할 것은, Copy assignment operator 는 (당연히) constructor 가 아니라는 점이다.
	- 따라서 object 선언시에 초기화를 위한 `=` 는 copy assignment operator 가 아니라 [[Cpp - class Copy constructor, 복사 생성자|copy constructor]] 가 호출되고
	- Constructor 에서 사용할 수 있는 `: var_name(var_name)` 와 같은 [[Cpp - class Constructor, 생성자#Member Initializer List|member initializer list]] 는 여기서는 사용하지 못한다는 점이다.
- 가령, 다음의 예시에서는:

```cpp
#include <iostream>
#include <string>

class Example {
private:
	std::string name_;
public:
	Example(std::string name) : name_(name) {}
	Example& operator=(Example& other);
	Example(Example& other);
	inline void Print() { std::cout << this->name_ << std::endl; }
};

Example& Example::operator=(Example& other) {
	std::cout << "Copy assignment operator called: this(" << this->name_ <<
		"), other(" << other.name_ << ")" << std::endl;
	this->name_ += "_from_" + other.name_;
	return *this;
}

Example::Example(Example& other) : name_(other.name_ + "_copied") {
	std::cout << "Copy constructor called: this(" << this->name_ <<
		"), other(" << other.name_ << ")" << std::endl;
}

int main() {
	Example ex1("ex1");
	Example ex2("ex2");
	Example ex3 = ex1;
	ex2 = ex1;
	ex1.Print();
	ex2.Print();
	ex3.Print();
}
```

- 다음과 같이 출력된다:

```
Copy constructor called: this(ex1_copied), other(ex1)
Copy assignment operator called: this(ex2), other(ex1)
ex1
ex2_from_ex1
ex1_copied
```