---
tags:
  - mdg
  - algorithm
  - interview
  - sort
date: 2026-04-04
---
> [!info] 문제 링크
> - [프로그래머스](https://school.programmers.co.kr/learn/courses/30/lessons/42748)

> [!tip] 요약
> - 0-base index 가 아닐 때 조심해야된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260404211606.png]]

- 0-base 가 아닐때 생각을 잘 해야 된다.

```cpp
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

vector<int> solution(vector<int> array, vector<vector<int>> commands) {
	vector<int> ret;
	for (auto &c : commands) {
		vector<int> copied(array.begin() + c[0] - 1, array.begin() + c[1]);
		sort(copied.begin(), copied.end());
		ret.push_back(copied[c[2] - 1]);
	}

	return ret;
}
```
