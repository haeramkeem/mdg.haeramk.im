---
tags:
  - cpp
  - cpp-optional
date: 2024-07-12
---
## TL;DR

- `std::optional` 객체를 생성하는 방법은 여러 가지가 있다.
- 첫번째는 그냥 `std::optional` 을 모른척해버리는 방법이다.

```cpp
std::optional<std::string> opt = "goodday";
```

- 두번째는 `std::make_optional()` 을 이용하는 것이다.

```cpp
auto opt = std::make_optional("goodday");
```

- 세번째는 [[Cpp - class Copy constructor, 복사 생성자|copy constructor]] 를 이용하는 것이다.

```cpp
auto opt = std::optional<std::string>("goodday");
```

- 또는 이것도 된다.

```cpp
auto opt = std::optional<std::string>{"goodday"};
```

## 주의..

- 위의 예시들은 모두 `std::optional` 로 감싸진 "원래" 객체가 [[Cpp - class Copy constructor, 복사 생성자|copy constructor]] 를 지원하는 경우에만 가능하다.
	- 만약 copy 가 안된다면, `std::move` 와 함께 사용해야 한다는 것을 항상 잊지 말자