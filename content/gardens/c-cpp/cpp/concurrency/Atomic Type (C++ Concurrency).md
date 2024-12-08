---
tags:
  - cpp
  - cpp-concurrency
  - cpp-atomic
date: 2024-07-17
---
> [!info]- 참고한 것들
> - [공문](https://en.cppreference.com/w/cpp/atomic/atomic)

## 란?

```cpp title="문법"
std::atomic<int> my_int_;
```

- 일반적으로 어떤 연산이 "atomic" 하다는 것은, 한번에 실행되고 중간에 방해받지 않는다는 것을 의미한다.
	- 즉, 연산이 중간에 멈추는 일은 없다는 것.
- C++ 에서는 `std::atomic<T>` 를 통해서 어떤 자료형에 대한 연산을 atomic 하게 선언할 수 있고, 이 자료형의 연산에 대해서는 별도의 concurrency control 이 필요 없다.
- 다만, 모든 자료형을 atomic 으로 선언할 수는 없다고 한다. `int` 나 `bool` 와 같은 primitive 들만 가능하고, `std::map` 와 같은 애들은 불가능하다.

## 예시 코드

```cpp {8}
#include <iostream>
#include <vector>
#include <atomic>
#include <thread>

class Counter {
private:
	std::atomic<int> atom_;
	int non_atom_;
	std::vector<std::thread> thd_;
public:
	Counter();
	void Inc();
	void Print();
};

Counter::Counter() : atom_(0), non_atom_(0) {
	for (int i = 0; i < 10; i++) {
		this->thd_.emplace_back([&] { Inc(); });
	}
	for (int i = 0; i < 10; i++) {
		this->thd_[i].join();
	}
}

void Counter::Inc() {
	for (int i = 0; i < 10000; i++) {
		this->atom_++;
		this->non_atom_++;
	}
}

void Counter::Print() {
	std::cout << "atom_=" << this->atom_ <<
		" non_atom_=" << this->non_atom_ << std::endl;
}
 
int main() {
	Counter ctr;
	ctr.Print();
}
```

- 위 예제는 thread 10 개가 atomic 여부가 다른 두 공유 정수 변수에 1씩 더하는 것이다.

```
atom_=100000 non_atom_=75145
```

- 예상한 것처럼, `non_atom_` 의 경우에는 thread-safe 하지 않아 이상한 결과가 나온 것을 볼 수 있는 반면, `atom_` 의 경우에는 `std::atomic` 으로 선언되어 있어 다른 thread 의 방해를 받지 않아 정상적으로 결과가 나오는 것을 볼 수 있다.