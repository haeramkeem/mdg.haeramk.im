---
tags:
  - mdg
  - algorithm
  - interview
  - brute-force
date: 2026-07-21
aliases:
  - LeetCode 3499
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/maximize-active-section-with-trade-i)

> [!tip] 요약
> - 쉬운 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260721110754.png]]

- `1` 양옆에 있는 `0` 들의 개수 최대값을 구해주면 된다. 이상한 함정 없이 쉽게 풀리는 문제.

```cpp
class Solution {
public:
	int maxActiveSectionsAfterTrade(string s) {
		bool is_1 = true;
		int zeros = 0;
		int cnt = 0;
		int prev_cnt = -1;
		int max_trade = 0;

		for (char c : s) {
			if (c == '1') {
				if (!is_1) {
					if (prev_cnt != -1) {
						max_trade = max(max_trade, prev_cnt + cnt);
					}

					prev_cnt = cnt;
					cnt = 0;
					is_1 = true;
				}
			} else /* (c == '0') */ {
				zeros++;
				cnt++;
				is_1 = false;
			}
		}

		if (!is_1 && prev_cnt != -1) {
			max_trade = max(max_trade, prev_cnt + cnt);
		}

		return s.size() - zeros + max_trade;
	}
};
```
