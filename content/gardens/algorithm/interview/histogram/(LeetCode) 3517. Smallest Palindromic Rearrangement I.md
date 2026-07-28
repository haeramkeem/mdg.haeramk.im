---
tags:
  - mdg
  - algorithm
  - interview
  - histogram
date: 2026-07-28
aliases:
  - LeetCode 3517
  - LeetCode 3517. Smallest Palindromic Rearrangement I
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/smallest-palindromic-rearrangement-i)

> [!tip] 요약
> - 쉬운 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260728220501.png]]

- 문제를 딱 보면 histogram 을 사용하면 되겠다는 생각이 들거고, 그렇게 하면 풀린다.

```cpp
#define NUM_ALPHA ('z' - 'a' + 1)

class Solution {
	array<int, NUM_ALPHA> histogram{};
public:
	string smallestPalindrome(string s) {
		int n = s.size();
		int si = 0;

		for (int i = 0; i < (n >> 1); i++) {
			histogram[s[i] - 'a']++;
		}

		for (int i = 0; i < NUM_ALPHA; i++) {
			while (histogram[i]) {
				s[si] = 'a' + i;
				s[n - si - 1] = 'a' + i;
				histogram[i]--;
				si++;
			}
		}

		return s;
	}
};
```

- 한가지 최적화아닌 최적화는
	- 저 `histogram` 은 private field 로 선언이 되어 있고, 사실은 매 함수가 실행될 때는 모두 0으로 초기화되어있어야 한다.
	- 근데 생각해보면 이것은 함수가 실행되며 값들이 증가했다가, 다시 감소해서 0으로 돌아온다. 그래서 명시적인 초기화코드가 없어도 안전하다.