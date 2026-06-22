---
tags:
  - mdg
  - algorithm
  - interview
  - string
date: 2026-06-19
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/longest-common-prefix)

> [!tip] 요약
> - 쉬운 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260619104359.png]]

- [[Trie (Data Structure)|Trie]] 를 써도 되지만, 간단한 문제니까 그냥 하나하나 비교했다.

```cpp
#define MIN(a, b) ((a) < (b) ? (a) : (b))

class Solution {
public:
	string longestCommonPrefix(vector<string>& strs) {
		string lcp = strs[0];

		for (int i = 1; i < strs.size(); i++) {
			auto &cur = strs[i];
			int len = MIN(lcp.size(), cur.size());
			string cp = "";

			for (int j = 0; j < len; j++) {
				if (lcp[j] == cur[j]) {
					cp += lcp[j];
				} else {
					break;
				}
			}

			lcp = cp;
		}

		return lcp;
	}
};
```
