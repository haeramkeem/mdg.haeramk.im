---
tags:
  - cpp
  - cpp-map
date: 2024-07-01
---
> [!info]- 참고한 것들
> - [스댕](https://stackoverflow.com/a/1939971)

> [!tip] `map` 이나 `unordered_map` 이나 동일하다.

## TL;DR

```cpp
#include <map>

using namespace std;

int main() {
	map<string, int> m;
	m["first element"] = 1;
	if (m.find("first element") != m.end()) {
		// Found
	} else {
		// Not found
	}
}
```

