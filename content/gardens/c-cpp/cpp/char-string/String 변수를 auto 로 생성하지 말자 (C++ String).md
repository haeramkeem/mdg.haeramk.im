---
tags:
  - cpp
  - cpp-string
date: 2024-07-03
---
## 왜?

- 아래의 코드를 보자.

```cpp
#include <iostream>

int main() {
	auto str = "";

	for (auto c : "abcdefghijklmnopqrstuvwxyz") {
		str += c;
	}

	std::cout << "str(" << str << ")" << std::endl;
}
```

- 당연히 출력  결과는 `"abcdefghijklmnopqrstuvwxyz"` 이라고 생각할 수 있지만, 그렇지 않다.
- 결과는:

```
str()
```

- 근데 생각해보면 아주 이상한 일은 아니다. C++ 는 C 에서 파생되었기에, 저런 string literal 을 `std::string` 이 아니라 `const char*` 로 취급하는 것은 합당하다고 생각할 수 있다.
- 근데 다른 *Go* 급진 언어 쓰다가 C++ 로 돌아오면 실수할 수도 있기 때문에 조심하자.
- 아래처럼 바꾸면 정상적으로 나온다.

```cpp
#include <iostream>

int main() {
	std::string str;

	for (auto c : "abcdefghijklmnopqrstuvwxyz") {
		str += c;
	}

	std::cout << "str(" << str << ")" << std::endl;
}
```

```
str(abcdefghijklmnopqrstuvwxyz)
```

- 아니면 `auto` 를 사용하고자 한다면 다음과 같이 할 수 있을 것이다.

```cpp
#include <iostream>

int main() {
	auto str = std::string();

	for (auto c : "abcdefghijklmnopqrstuvwxyz") {
		str += c;
	}

	std::cout << "str(" << str << ")" << std::endl;
}
```

```
str(abcdefghijklmnopqrstuvwxyz)
```