---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-04-04
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/n-th-tribonacci-number)

> [!tip] 요약
> - 쉬운문제일수록 최적화를 고민하자.

## 최종

> [!info]- 결과
> ![[Pasted image 20260404162515.png]]

- 이런 피보나치류는 전통적인 DP 문젠데, 그냥 vector 만들어서 채워도 되지만 생각을 쫌만 해봐도 변수 3개면 충분하다는 걸 알 수 있다.
- 그래서 코드는:

```cpp
class Solution {
public:
	int tribonacci(int n) {
		int buffer[3] = {0};

		buffer[0] = 0;
		buffer[1] = 1;
		buffer[2] = 1;

		for (int i = 3; i <= n; i++) {
			buffer[i % 3] = buffer[0] + buffer[1] + buffer[2];
		}

		return buffer[n % 3];
	}
};
```

## Go

> [!info]- 결과
> ![[Pasted image 20260404163146.png]]

- 이전에 Go로 작성해놓은게 있어서 여기로 옮겨버리기

```go
func tribonacci(n int) int {
	cache := make([]int, 3, n + 3)
	cache[0], cache[1], cache[2] = 0, 1, 1
	for i := 3; i <= n; i++ {
		cache = append(cache, cache[i - 1] + cache[i - 2] + cache[i - 3])
	}
	return cache[n]
}
```

- 언제나 느끼는거지만 Go가 컴파일러 최적화가 잘 돼있어서 그런가 메모리 사용량이 진짜 적다.

## JavaScript

> [!info]- 결과
> ![[Pasted image 20260404163257.png]]

- 마찬가지로 js로 작성해놓은게 있어서 여기로 옮기기
	- 그때 왜 이렇게 짰는지는 나도 모르겠다.

```js
var tribonacci = function(n) {
	if (n < 1) {
		return 0;
	}

	let r0 = 0;
	let r1 = 1;
	let r2 = 1;
	let t0 = 0;
	let t1 = 0;
	for (let i = 2; i < n; i++) {
		t0 = r1;
		t1 = r2;
		r2 += r1 + r0;
		r0 = t0;
		r1 = t1;
	}
	return r2;
};
```
