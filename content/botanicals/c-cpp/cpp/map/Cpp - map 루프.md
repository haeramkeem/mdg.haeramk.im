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
	for(auto it = m.begin(); it != m.end(); it++) {
		cout << it->first << endl; // Key 값
		cout << it->second << endl; // Value 값
	}
}
```