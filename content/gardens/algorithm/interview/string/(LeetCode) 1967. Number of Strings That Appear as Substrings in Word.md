---
tags:
  - mdg
  - algorithm
  - interview
  - string
date: 2026-06-29
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/number-of-strings-that-appear-as-substrings-in-word)

> [!tip] 요약
> - 쉬운 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260629095916.png]]

- 그냥 `string::find()` 로 찾으면 된다. 어려운 문제는 아니다.

```cpp
class Solution {
public:
	int numOfStrings(vector<string>& patterns, string word) {
		int cnt = 0;

		for (auto &s : patterns) {
			cnt += (word.find(s) != -1) ? 1 : 0;
		}

		return cnt;
	}
};
```

- 다만 조심할것은
	- `string::find()` 의 return type 이 iterator 가 아니라 `size_t` 이다. 그래서 못찾으면 `-1` 이 반환된다.
