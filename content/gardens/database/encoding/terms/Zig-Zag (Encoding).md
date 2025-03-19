---
tags:
  - db-encoding
date: 2024-08-06
aliases:
  - Zig-zag Encoding
  - Zig-zag
---
## Zig-zag encoding

- 이건 계산하는 것은 어렵지 않다.
	- 양수라면, $2 \times x$ 를 하고
	- 음수라면, $-2 \times x - 1$ 을 해주면 된다.
- 근데 이 방식의 문제는 이렇게 하면 "조건문 (branch)" 가 필요하다는 점이고, 이건 어셈블리 레벨에서 꽤나 비싼 연산이다.
- 위와 동일한 연산을 조건문 없이 해결할 수 있는데, 이것이 *Zig-zag encoding* 이다.
- 이렇게 하면 된다:
	- Encoding: `(x << 1) ^ (x >> 31)`
	- Decoding: `((y >>> 1) ^ ((y << 31) >> 31)` (여기서 `>>>` 는 unsigned right shift 이다.)
- 그리고, 이것을 코드로 나타내면 다음과 같다.

```cpp
#include <iostream>
#include <vector>

void print(std::vector<int> vec) {
	auto back = vec.back();
	vec.pop_back();
	std::cout << "{";
	for (auto el : vec) {
		std::cout << el << ", ";
	}
	std::cout << back << "}" << std::endl;
}

int main() {
	std::vector<int> delta = {1,2,5,5,5,7,0,-1,4};
	print(delta);
	std::vector<int> enc, dec;

	for (auto x : delta) {
		enc.push_back((x << 1) ^ (x >> 31));
	}
	print(enc);

	for (auto y : enc) {
		unsigned int unsigned_right_shift = y >> 1;
		dec.push_back(unsigned_right_shift ^ (y << 31) >> 31);
	}
	print(dec);
}
```

```
{1, 2, 5, 5, 5, 7, 0, -1, 4}
{2, 4, 10, 10, 10, 14, 0, 1, 8}
{1, 2, 5, 5, 5, 7, 0, -1, 4}
```

> [!tip]- 참고: C++ Unsigned right shift
> - [Java](https://www.javatpoint.com/unsigned-right-shift-operator-in-java) 나 [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Unsigned_right_shift) 에서는 `>>>` 로 unsigned right shift 연산을 제공한다.
> - 하지만 C++ 에서는 그딴거 [없다](https://stackoverflow.com/a/2429490). C++ 에서는 type 을 `unsigned int` 로 선언하여 동일하게 연산할 수 있다.