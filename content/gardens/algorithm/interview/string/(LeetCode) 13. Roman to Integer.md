---
tags:
  - mdg
  - algorithm
  - interview
  - brute-force
date: 2026-06-19
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/roman-to-integer)

> [!tip] 요약
> - 쉬운 구현 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260619103359.png]]

- 그냥 규칙대로 구현해주면 된다.

```cpp
class Solution {
public:
	int romanToInt(string s) {
		int acc = 0;

		for (int i = 0; i < s.size(); i++) {
			switch (s[i]) {
			case 'I':
				if (i + 1 < s.size()) {
					if (s[i + 1] == 'V') {
						acc += 4;
						i++;
					} else if (s[i + 1] == 'X') {
						acc += 9;
						i++;
					} else {
						acc += 1;
					}
				} else {
					acc += 1;
				}
				break;
			case 'V':
				acc += 5;
				break;
			case 'X':
				if (i + 1 < s.size()) {
					if (s[i + 1] == 'L') {
						acc += 40;
						i++;
					} else if (s[i + 1] == 'C') {
						acc += 90;
						i++;
					} else {
						acc += 10;
					}
				} else {
					acc += 10;
				}
				break;
			case 'L':
				acc += 50;
				break;
			case 'C':
				if (i + 1 < s.size()) {
					if (s[i + 1] == 'D') {
						acc += 400;
						i++;
					} else if (s[i + 1] == 'M') {
						acc += 900;
						i++;
					} else {
						acc += 100;
					}
				} else {
					acc += 100;
				}
				break;
			case 'D':
				acc += 500;
				break;
			case 'M':
				acc += 1000;
				break;
			}
		}

		return acc;
	}
};
```
