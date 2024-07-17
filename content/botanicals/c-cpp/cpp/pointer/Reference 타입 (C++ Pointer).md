---
tags:
  - cpp
  - cpp-pointer
date: 2024-07-12
---
## 란?

- 선언은 pointer 로, 사용은 dereference 로 하는 문법적 설탕이다.
- 가령 다음의 예시를 보면,

```cpp {6-7}
#include <iostream>

int main() {
	int normal = 1;
	int& reference = normal;
	std::cout << std::boolalpha << (normal == reference) << std::endl;
	std::cout << std::boolalpha << (&normal == &reference) << std::endl;
	return 0;
}
```

```
true
true
```

- 일반 변수인 `normal` 과 reference type 인 `reference` 의 값을 비교했을 때,
- 그리고 두 변수의 pointer 를 비교했을 때 모두 참이 나오는 것을 볼 수 있다.
- 주의할 것은
	- Reference type 을 선언할 때는 반드시 초기화를 해야 한다. (5번째 줄)