---
tags:
  - mdg
  - algorithm
  - interview
  - mapset
date: 2026-05-28
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/count-the-number-of-special-characters-i)

> [!tip] 요약
> - 쉬운 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260528204158.png]]

- 앞에서부터 순회하며 special 한 놈을 찾아내면 된다.
- Set 을 사용해서 lowercase 와 uppercase 가 모두 나오는지 확인하고, 그리고 중복방지를 위한 set 을 하나 더 사용하면 된다.

```cpp
#define bms unsigned int
#define CHECK_BMS(target, idx) (((target) >> (idx)) & 0x1)

class Solution {
public:
	int numberOfSpecialChars(string word) {
		bms lower = 0;
		bms upper = 0;
		bms special = 0;
		int cnt = 0;

		for (auto c : word) {
			if ('a' <= c && c <= 'z') {
				lower |= 1 << (c - 'a');
				if (CHECK_BMS(upper, c - 'a') && !CHECK_BMS(special, c - 'a')) {
					special |= 1 << (c - 'a');
					cnt++;
				}
			} else {
				upper |= 1 << (c - 'A');
				if (CHECK_BMS(lower, c - 'A') && !CHECK_BMS(special, c - 'A')) {
					special |= 1 << (c - 'A');
					cnt++;
				}
			}
		}

		return cnt;
	}
};
```

- Set 은 간단하게 [[Bitmap (Encoding)|BMS]] 사용했다.