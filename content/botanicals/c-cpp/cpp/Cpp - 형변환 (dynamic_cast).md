---
tags:
  - cpp
date: 2024-07-01
---
## 기본 사용법

```cpp
#include <iostream>

using namespace std;

class Base {
public:
	virtual auto PrintName() -> void { cout << "Base" << endl; }
};

class Derived_A : public Base {
public:
	auto PrintName() -> void override { cout << "Derived_A" << endl; }
};

int main() {
	// Upcast
	Base* upcasted = new Derived_A();
	// This prints "Derived_A" as the obj actually is `Derived_A` type
	upcasted->PrintName();

	// Downcast
	//  usage #1: pointer type
	Derived_A* downcasted = dynamic_cast<Derived_A*>(upcasted);
	//  usage #2: reference type
	Derived_A& downcasted_ref = dynamic_cast<Derived_A&>(*upcasted);

	delete upcasted;
}
```

## 잘못된 사용법 (에러 혹은 `nullptr`)

```cpp
#include <iostream>

using namespace std;

class Base {
public:
	virtual auto PrintName() -> void { cout << "Base" << endl; }
};

class Derived_A : public Base {
public:
	auto PrintName() -> void override { cout << "Derived_A" << endl; }
};

class Derived_B : public Base {
public:
	auto PrintName() -> void override { cout << "Derived_B" << endl; }
};

int main() {
	Base* base = new Base();
	Derived_B* derived_b = new Derived_B();

	// This returns `nullptr`
	Derived_A* derived_a_ptr;
	derived_a_ptr = dynamic_cast<Derived_A*>(base);
	derived_a_ptr = dynamic_cast<Derived_A*>(derived_b);

	// This can be used to detect class
	if (dynamic_cast<Derived_B*>(derived_a_ptr) == nullptr) {
		// Do something...
	}

	// This throws error
	Derived_A& derived_a_ref = dynamic_cast<Derived_A&>(*base);
	delete base;
	delete derived_b;
}
```