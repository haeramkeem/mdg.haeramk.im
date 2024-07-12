---
tags:
  - cpp
  - cpp-class
date: 2024-07-12
---
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