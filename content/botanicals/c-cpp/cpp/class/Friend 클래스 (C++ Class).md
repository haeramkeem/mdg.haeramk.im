---
tags:
  - cpp
  - cpp-class
date: 2204-07-15
---
> [!info]- 참고한 것들
> - [위키독스](https://wikidocs.net/21185)

## 란?

- 한 클래스에서 다른 한 class 의 private member 에 접근해야 할 필요가 있을 때도 있다.
- 이때 public 으로 getter, setter 을 선언해 이러한 접근을 제어할 수도 있지만,
- `friend` 키워드를 사용하게 되면 해당 class 에서는 private member 에 맘껏 접근할 수 있다.
- 다음의 예시를 보자.

```cpp {14}
#include <iostream>

class Ex1 {
private:
	int integer_;
public:
	Ex1() : integer_(123) {}
};

class Ex2 {
private:
	Ex1 ex1;
public:
	inline void Print() { std::cout << ex1.integer_ << std::endl; }
};

int main() {
	Ex2 ex2;
	ex2.Print();
}
```

- 이때, 당연히 14번째 줄에서 에러가 난다.

```
friend.cpp:14:40: error: 'integer_' is a private member of 'Ex1'
inline void Print() { std::cout << ex1.integer_ << std::endl; }
                                       ^
friend.cpp:5:5: note: declared private here
int integer_;
    ^
1 error generated.
```

- 근데, `Ex1` 에서 `Ex2` 를 `friend` 로 지정해 주면 마법처럼 가능해 진다.

```cpp {4}
#include <iostream>

class Ex1 {
friend class Ex2;
private:
	int integer_;
public:
	Ex1() : integer_(123) {}
};

class Ex2 {
private:
	Ex1 ex1;
public:
	inline void Print() { std::cout << ex1.integer_ << std::endl; }
};

int main() {
	Ex2 ex2;
	ex2.Print();
}
```

```
123
```