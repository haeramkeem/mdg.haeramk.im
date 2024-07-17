---
tags:
  - cpp
  - cpp-class
date: 2024-07-12
---
> [!info]- 참고한 것들
> - [공문](https://en.cppreference.com/w/cpp/language/constructor)

## 코드 예시

- 너무 기본적인 문법이긴 하지만 그래도 예시 하나 메모해놓자.
- *Constructor* (*생성자*) 는 object 가 생성될 때 호출되는 함수이다.

```cpp {8, 11-13}
#include <iostream>
#include <string>

class Example {
private:
	std::string name_;
public:
	Example(std::string name);
};

Example::Example(std::string name) : name_(name) {
	std::cout << "Constructor called (" << this->name_ << ")" << std::endl;
}

int main() {
	Example ex("ex");
}
```

- 결과는:

```
Constructor called (ex)
```

## Member Initializer List

- 위 예제에서 `: name_(name)` 는 *Member Initializer List* 라고 부른다.
- 이것도 문법적 설탕으로, 원래는 생성자 내에서 `this->name_ = name;` 로 초기화해줬어야 할 것을 간소화시킨 것이라 할 수 있다.
- 얘는 일반 constructor 뿐 아니라 [[Copy constructor, 복사 생성자 (C++ Class)|copy constructor]] 나 [[Move constructor, 이동 생성자 (C++ Class)|move constructor]] 에서도 사용할 수 있고,
- 이 *Member initializer list* 가 실행된 다음에 생성자의 `{}` 가 실행된다.