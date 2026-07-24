---
tags:
  - mdg
  - algorithm
  - interview
  - stack
date: 2026-07-22
aliases:
  - LeetCode 32
  - LeetCode 32. Longest Valid Parentheses
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/longest-valid-parentheses)

> [!tip] 요약
> - [[(LeetCode) 20. Valid Parentheses|LeetCode 20]] 의 진화형

## 최종

> [!info]- 결과
> ![[Pasted image 20260722095418.png]]

- [[(LeetCode) 20. Valid Parentheses|LeetCode 20]] 에서 좀 더 나아가서 각 valid parentheses substring 의 최대 길이를 구해주면 된다.
- 어려운 문제는 아닌데 삽질하느라 1시간 넘김.

```cpp
class Solution {
public:
	int longestValidParentheses(string s) {
		int n = s.size();
		stack<int> stk;
		stack<pair<int, int>> par;

		for (int i = 0; i < n; i++) {
			if (s[i] == '(') {
				stk.push(i);
			} else if (!stk.empty()) {
				if (par.empty()) {
					par.push({stk.top(), i});
				} else {
					auto &p = par.top();

					if (p.second + 1 == stk.top()) {
						// {p}() -> {p}
						p.second = i;
					} else if (p.first - 1 == stk.top() && p.second + 1 == i) {
						// ({p}) -> {p}
						p.first = stk.top();
						p.second = i;

						// Collapse
						while (1 < par.size()) {
							auto t = par.top();
							par.pop();

							auto &p = par.top();
							if (p.second + 1 == t.first) {
								// {p}{t} -> {p}
								p.second = t.second;
							} else {
								par.push(t);
								break;
							}
						}
					} else {
						par.push({stk.top(), i});
					}
				}

				stk.pop();
			}
		}

		int max_len = 0;
		while (!par.empty()) {
			auto &p = par.top();
			max_len = max(max_len, p.second - p.first + 1);
			par.pop();
		}

		return max_len;
	}
};
```
