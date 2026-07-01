---
tags:
  - mdg
  - algorithm
  - interview
  - string
date: 2026-07-01
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/length-of-last-word)

> [!tip] 요약
> - 쉬운 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260701085906.png]]

- C++ 에는 `split()` 따위가 없어서 비스무리하게 구현해서 풀면 된다.
	- `space` 라는 flag 를 사용해서 space 를 만나면 flag 를 올리고, 올라가있는 상태에서 non-space 를 만나면 길이를 1로 초기화하도록 해서 풀었다.

```cpp
class Solution {
public:
	int lengthOfLastWord(string s) {
		bool space = false;
		int len = 0;

		for (char c : s) {
			if (c == ' ') {
				space = true;
			} else {
				len = space ? 1 : (len + 1);
				space = false;
			}
		}

		return len;
	}
};
```
