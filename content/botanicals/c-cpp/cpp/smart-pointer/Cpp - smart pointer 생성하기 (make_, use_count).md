---
tags:
  - cpp
date: 2024-07-01
---
## TL;DR

```cpp
#include <iostream>
#include <memory>

using namespace std;

int main() {
	// `shared_ptr` 생성
	auto sh1 = make_shared<int>(123);
	// 이렇게 하면 포인터가 복사된다 (copy constructor)
	auto sh2 = sh1;
	auto sh3 = shared_ptr<int>(sh1);

	// `use_count()` 는 `shared_ptr` 의 reference count 를 반환한다.
	cout << sh1.use_count() << endl;

	// 같은 포인터인지 확인
	cout << "sh1 == sh2 ? " << boolalpha << (sh1 == sh2) << endl;
	cout << "sh1 == sh3 ? " << boolalpha << (sh1 == sh3) << endl;

	// `unique_ptr` 생성
	auto un1 = make_unique<int>(1234);
	// `unique_ptr` 은 복사가 안되고, 따라서 이건 컴파일 에러가 난다
	auto un2 = un1;
}
```