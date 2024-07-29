---
tags:
  - cpp
  - cpp-map
  - cpp-stl
date: 2024-06-26
---
> [!tip] `map` 이나 `unordered_map` 이나 동일하다.

## TL;DR

```cpp
#include <iostream>
#include <map>

using namespace std;

int main() {
	map<string, int> m;
	m["first element"] = 1;
	m.insert(make_pair("second element", 2));
	m.emplace("thrid element", 3);
}
```

- 여기서 주의할 점은 `insert` 와 `emplace` 의 경우에는 원소 overwrite 가 안된다는 것이다.
	- 즉, overwrite 를 위해서는 `[]` 연산자만을 사용해야 함
	- [참고](https://stackoverflow.com/a/26549656)