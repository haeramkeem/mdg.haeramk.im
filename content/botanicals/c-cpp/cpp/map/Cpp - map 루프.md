---
tags:
  - cpp
  - cpp-map
date: 2024-06-27
---
> [!tip] `map` 이나 `unordered_map` 이나 동일하다.

## TL;DR

```cpp
#include <iostream>
#include <map>

using namespace std;

int main() {
	map<string, int> m;
	// 고전적인 방식
	// for(auto it = m.begin(); it != m.end(); it++) {
	for(const auto& pair : m) {
		cout << pair->first << endl; // Key 값
		cout << pair->second << endl; // Value 값
	}
}
```