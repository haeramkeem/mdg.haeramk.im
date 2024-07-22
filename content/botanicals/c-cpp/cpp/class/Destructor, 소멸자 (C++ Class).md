---
tags:
  - cpp
  - cpp-class
date: 2024-07-12
---
## 코드 예시

- *Destructor* (*소멸자*) 는 object 가 삭제될 때 호출되는 함수이다.
- 보통 object 가 삭제되기 전에 해줘야 하는 작업 (가령 open 한 파일을 닫는 등) 을 수행할 때 사용한다.

```cpp {9, 14-16}
#include <iostream>
#include <string>

class Example {
private:
	std::string name_;
public:
	Example(std::string name);
	~Example();
};

Example::Example(std::string name) : name_(name) {}

Example::~Example() {
	std::cout << "Destructor callled (" << this->name_ << ")" << std::endl;
}

int main() {
	{
		Example ex1("ex1");
	}
	Example* ex2 = new Example("ex2");
	delete ex2;
}
```

```
Destructor callled (ex1)
Destructor callled (ex2)
```

- 기본적으로 object 는 그놈이 속한 level 에서 수명 주기를 갖는다.
	- 이때문에 `ex1` 이 `{}` 를 벗어나자 삭제되는 것.
- 혹은 `new` 키워드를 이용해 동적할당한 경우에도 `delete` 로 할당 해제했을 때 destructor 가 호출되는 것을 볼 수 있다.