---
tags:
  - mdg
  - algorithm
  - interview
  - brute-force
date: 2026-06-19
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/palindrome-number)

> [!tip] 요약
> - 쉬운 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260619101847.png]]

- 그냥 뒤집은 다음 비교해주면 된다.

```cpp
class Solution {
public:
	bool isPalindrome(int x) {
		if (x >= 0) {
			int cur = x;
			unsigned int reverse = 0;

			while (cur) {
				int digit = cur % 10;
				reverse = reverse * 10 + digit;
				cur = (cur - digit) / 10;
			}

			return x == reverse;
		}

		return false;
	}
};
```

- 다만 `reverse` 를 `int` 로 하면 overflow 가 난다. 그래서 `unsigned` 로 해준것.