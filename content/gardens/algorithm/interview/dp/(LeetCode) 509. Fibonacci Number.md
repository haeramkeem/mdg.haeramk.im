---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-07-31
aliases:
  - LeetCode 509
  - LeetCode 509. Fibonacci Number
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/fibonacci-number)

> [!tip] 요약
> - 전통과 역사

## 최종

> [!info]- 결과
> ![[Pasted image 20260731101644.png]]

- 만반잘부

```cpp
class Solution {
	array<int, 2> dp;
public:
	int fib(int n) {
		dp[0] = 0;
		dp[1] = 1;
		for (int i = 2; i <= n; i++) {
			int prev_1 = (i - 1) & 0x1;
			int prev_2 = (i - 2) & 0x1;
			int cur = i & 0x1;
			dp[cur] = dp[prev_1] + dp[prev_2];
		}
		return dp[n & 0x1];
	}
};
```

## 다른 풀이

### Go

> [!info]- 결과
> ![[Pasted image 20260731101909.png]]

> [!info]- 코드
> ```go
> func fib(n int) int {
> 	if n < 1 {
> 		return 0
> 	}
> 	cache := make([]int, n + 1)
> 	cache[0], cache[1] = 0, 1
> 	for i := 2; i <= n; i++ {
> 		cache[i] = cache[i - 1] + cache[i - 2]
> 	}
> 	return cache[n]
> }
> ```

- 이전 풀이 옮기기

### JavaScript

> [!info]- 결과
> ![[Pasted image 20260731102028.png]]

> [!info]- 코드
> ```js
> /**
>  * @param {number} n
>  * @return {number}
>  */
> var fib = function(n) {
> 	if (n < 1) {
> 		return 0;
> 	}
> 	let t0 = 0;
> 	let t1 = 1;
> 	let t2 = 0;
> 	for (let i = 1; i < n; i++) {
> 		t2 = t1;
> 		t1 += t0;
> 		t0 = t2;
> 	}
> 	return t1;
> };
> ```

- 이전 풀이 옮기기