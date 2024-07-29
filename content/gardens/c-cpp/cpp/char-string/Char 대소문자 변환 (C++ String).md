---
tags:
  - cpp
  - cpp-string
date: 2024-07-03
---
> [!info]- 참고한 것들
> - [어떤 글](https://www.programiz.com/cpp-programming/library-function/cctype/toupper)

## TL;DR

- `cctype` 을 꼭 include 해주자

```cpp {2}
#include <iostream>
#include <cctype>

int main() {
	char low_a = tolower('A');
	char up_a = toupper('a');
	std::cout << low_a << std::endl;
	std::cout << up_a << std::endl;
	return 0;
}
```

- 결과

```
a
A
```