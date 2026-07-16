---
tags:
  - mdg
  - algorithm
  - interview
  - brute-force
  - gcd
date: 2026-07-16
aliases:
  - LeetCode 3867
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/sum-of-gcd-of-formed-pairs)

> [!tip] 요약
> - 쉬운문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260716150612.png]]

- [[Euclidean Algorithm (GCD)|유클리드 호제법]] 사용해서 최대공약수 구하는 쉬운 문제다.

```cpp
class Solution {
	int getGCD(int a, int b) {
		while (b) {
			int rem = a % b;
			a = b;
			b = rem;
		}
		return a;
	}
public:
	long long gcdSum(vector<int>& nums) {
		int n = nums.size();
		vector<int> prefix_gcd(n);
		int mx = nums[0];
		long long ret = 0;

		prefix_gcd[0] = nums[0];

		for (int i = 1; i < n; i++) {
			mx = max(mx, nums[i]);
			prefix_gcd[i] = getGCD(mx, nums[i]);
		}

		sort(prefix_gcd.begin(), prefix_gcd.end());

		for (int l = 0; l < n; l++) {
			int r = n - l - 1;

			if (l < r) {
				ret += getGCD(prefix_gcd[l], prefix_gcd[r]);
			}
		}

		return ret;
	}
};
```
