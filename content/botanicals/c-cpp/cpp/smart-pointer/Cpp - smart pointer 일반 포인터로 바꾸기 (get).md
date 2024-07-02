---
tags:
  - cpp
date: 2024-07-01
---
## TL;DR

```cpp {8}
#include <iostream>
#include <memory>

using namespace std;

int main() {
	shared_ptr<int> shared_i = make_shared<int>(100);
	int* normal_i = shared_i.get();
	cout << *shared_i << " " << *normal_i << endl;
}
```