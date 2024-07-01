---
tags:
  - cpp
date: 2024-06-27
---
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