---
tags:
  - mdg
  - algorithm
  - interview
  - binary-search
date: 2026-06-22
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/guess-number-higher-or-lower)

> [!tip] 요약
> - 그냥 binary search 하면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260622175356.png]]

- Overflow 처리하는 것 때문에 좀 귀찮을 순 있는데, 그래도 그냥 binary search 하면 된다.

```cpp
/** 
 * Forward declaration of guess API.
 * @param  num   your guess
 * @return 		 -1 if num is higher than the picked number
 *				  1 if num is lower than the picked number
 *			   otherwise return 0
 * int guess(int num);
 */

#define uint unsigned int

class Solution {
public:
	int guessNumber(int n) {
		uint l = 0;
		uint r = n;

		while (l + 1 < r) {
			uint m = (l + r) >> 1;
			int res = guess(m);

			if (res < 0) {
				r = m;
			} else if (res > 0) {
				l = m;
			} else /* res == 0 */ {
				return m;
			}
		}

		if (guess(l) == 0) {
			return l;
		}

		return r;
	}
};
```
