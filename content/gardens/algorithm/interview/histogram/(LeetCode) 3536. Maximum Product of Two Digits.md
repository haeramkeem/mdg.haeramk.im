---
tags:
  - mdg
  - algorithm
  - interview
  - histogram
date: 2026-07-25
aliases:
  - LeetCode 3536
  - LeetCode 3536. Maximum Product of Two Digits
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/maximum-product-of-two-digits)

> [!tip] 요약
> - 쉬운 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260725110400.png]]

- 각 digit 에 대한 histogram 을 만들어서 풀면 된다. 아주 쉬운 문제.

```cpp
class Solution {
public:
	int maxProduct(int n) {
		array<int, 10> histogram{};
		int cnt = 2;
		int max_prod = 1;

		while (n) {
			histogram[n % 10]++;
			n /= 10;
		}

		for (int i = 9; 0 <= i && cnt; i--) {
			while (cnt && histogram[i]) {
				max_prod *= i;
				histogram[i]--;
				cnt--;
			}
		}

		return max_prod;
	}
};
```
