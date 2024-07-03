---
tags:
  - cpp
date: 2024-06-02
---
> [!info]- 참고한 것들
> - [어떤 블로그](https://seirion.github.io/cpp-most-vexing-parse/)

## 란?

- C++ 에서의 문법적 모호함때문에 발생하는 문제상황이다.
- C++ 에서는
	- `TYPE NAME(VALUE);` 는 객체를 생성하는 문법이고
	- `TYPE NAME(TYPE VALUE);` 는 함수의 prototype 을 선언하는 문법이다.
- 근데 그럼 `TYPE NAME();` 는 다음의 두가지로 해석될 수 있다.
	- Parameter 를 주지 않는 default constructor 를 이용해 객체를 생성하거나
	- Argument 를 받지 않는 함수의 prototype 을 선언하거나
- `g++` 같은 컴파일러에서는 이 모호한 상황에서 그냥 함수 prototype 을 선언한다고 가정하고, 이것이 *Vexing Parse* 이다.
- 따라서 아래의 코드를 컴파일해보면

```cpp
#include <iostream>

using namespace std;

class Test {
public:
	Test(int = 1);
private:
	int X;
	const int Y;
};

Test::Test(int v): X(v), Y(2) {}

int main() {
	const Test t1;
	const Test t2();
	const Test t3(3);
	return 0;
}
```

- 이런 warning 을 띄워준다.

```
test.cc:15:16: warning: empty parentheses interpreted as a function declaration [-Wvexing-parse]
  const Test t2();
               ^~
test.cc:15:16: note: remove parentheses to declare a variable
  const Test t2();
               ^~
1 warning generated.
```