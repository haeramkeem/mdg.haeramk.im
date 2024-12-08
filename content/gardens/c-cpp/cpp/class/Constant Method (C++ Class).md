---
tags:
  - cpp
  - cpp-class
date: 2024-07-03
---
## 가 뭔뎅?

- 메소드에 `const` 가 붙어있으면 그 메소드는 object 의 멤버들을 변경하지 못한다.
- 가령 아래와 같은 함수는 `const` 키워드 때문에 6번째 줄의 `=` 에서 컴파일 에러가 난다.

```cpp {5-6}
class Example {
private:
	int ex_i_;
public:
	auto SetExI(int& ex_i) const -> void {
		this->ex_i_ = ex_i;
	}
};
```

```
const_func.cc:6:13: error: cannot assign to non-static data member within const member function 'SetExI'
this->ex_i_ = ex_i;
~~~~~~~~~~~ ^
const_func.cc:5:6: note: member function 'Example::SetExI' is declared const here
auto SetExI(const int& ex_i) const -> void {
~~~~~^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
1 error generated.
```

- 이걸 사용하면 의도치 않게 멤버를 변경하게 되는 등의 실수를 미연에 방지할 수 있겠다 그쵸?