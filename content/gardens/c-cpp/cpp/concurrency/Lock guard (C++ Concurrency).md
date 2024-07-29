---
tags:
  - cpp
  - cpp-concurrency
  - cpp-mutex
date: 2024-07-17
---
> [!info]- 참고한 것들
> - [공문](https://en.cppreference.com/w/cpp/thread/lock_guard)

## 란?

```cpp title="문법"
std::lock_guard<std::mutex> my_guard_(my_mutex_);
```

- [[Mutex 사용법 (C++ Concurrency)|Mutex]] 를 별도로 lock, unlock 하지 않아도 원하는 block 내에서 항상 잡고 있게 해주는 wrapper class 이다.
	- 가령 어떤 함수 진입 시에 lock 을 걸고 탈출시에 unlock 해야 한다면, 함수의 시작과 끝에 `std::mutex::lock()`, `std::mutex::unlock()` 을 호출해 mutex 를 관리해야 한다.
	- 그리고 중간중간 `return` 으로 탈출하는 경우에도 `std::mutex::unlock()` 을 해줘야 한다.
	- 근데 이게 너무 귀찮자나 그치?
	- 그래서 C++ 에서 object 가 scope 를 벗어나면 [[Destructor, 소멸자 (C++ Class)|소멸자]] 가 호출되며 object 가 지워지는 것을 이용해, 소멸자 내에서 mutex unlock 을 수행해 귀찮게 위와 같이 구현하지 않아도 되게끔 도와준다.
- 코드 예시를 보자

## 코드 예시

```cpp {27}
#include <iostream>
#include <mutex>
#include <vector>
#include <thread>

class Counter {
private:
	int cnt_;
	std::vector<std::thread> thd_;
	std::mutex m_;
public:
	Counter();
	void Inc();
	void Print();
};

Counter::Counter() : cnt_(0) {
	for (int i = 0; i < 10; i++) {
		this->thd_.emplace_back([&] { Inc(); });
	}
	for (int i = 0; i < 10; i++) {
		this->thd_[i].join();
	}
}

void Counter::Inc() {
	std::lock_guard<std::mutex> lg(this->m_);
	for (int i = 0; i < 10000; i++) {
		this->cnt_++;
	}
}

void Counter::Print() {
	std::cout << "Count: " << this->cnt_ << std::endl;
}
 
int main() {
	Counter ctr;
	ctr.Print();
}
```

```
Count: 100000
```