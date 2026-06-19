---
tags:
  - mdg
  - algorithm
  - interview
  - stack
date: 2026-06-19
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/valid-parentheses)

> [!tip] 요약
> - 전통적인 괄호쌍문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260619110503.png]]

- 괄호쌍문제는 전통적인 stack 활용예시이다.

```cpp
class Solution {
public:
	bool isValid(string s) {
		stack<char> stk;

		for (char c : s) {
			switch (c) {
			case '(':
			case '{':
			case '[':
				stk.push(c);
				break;
			case ')':
			case '}':
			case ']':
				if (stk.empty()) {
					return false;
				} else {
					int diff = c - stk.top();

					if (diff != 1 && diff != 2) {
						return false;
					}

					stk.pop();
				}
				break;
			}
		}

		return stk.empty();
	}
};
```

- 한가지 고려한 점은
	- `'('` 와 `')'` 의 ASCII 차이는 1이고
	- `'{'` 와 `'}'`, `'['` 와 `']'` 의 ASCII 차이는 2다.
	- 그래서 stack top 이랑 차이를 비교했을 때 차이가 1 혹은 2 가 아니라면 비정상적인 괄호쌍인것
