---
tags:
  - mdg
  - algorithm
  - interview
  - string
date: 2026-04-05
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/robot-return-to-origin)

> [!tip] 요약
> - 하라는대로 하면 풀리는 문제.

## 최종

> [!info]- 결과
> ![[Pasted image 20260405222534.png]]

- 이문제는 너무 쉬운문제라 별 설명이 필요없다.
- 그래서 코드는:

```cpp
class Solution {
public:
	bool judgeCircle(string moves) {
		int pos[2] = {0};

		for (auto move : moves) {
			switch (move) {
			case 'R': pos[0]++; break;
			case 'L': pos[0]--; break;
			case 'U': pos[1]++; break;
			case 'D': pos[1]--; break;
			}
		}

		return pos[0] == 0 && pos[1] == 0;
	}
};
```
