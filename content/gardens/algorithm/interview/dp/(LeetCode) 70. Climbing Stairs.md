---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-05-29
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/climbing-stairs)

> [!tip] 요약
> - 가장 기본적인 DP 문제.

## 최종

> [!info]- 결과
> ![[Pasted image 20260529112628.png]]

- 점화식만 잘 짜면 된다.

```cpp
class Solution {
public:
	int climbStairs(int n) {
		// A(n+2) = A(n+1) + A(n)
		int buf[3];

		if (n == 1) {
			return 1;
		}

		buf[0] = 0; // A(0)
		buf[1] = 1; // A(1)
		buf[2] = 2; // A(2)

		for (int i = 0; i < n - 2; i++) {
			buf[0] = buf[1];
			buf[1] = buf[2];
			buf[2] = buf[0] + buf[1];
		}

		return buf[2];
	}
};
```

## 다른 언어 풀이

### Go

> [!info]- 결과
> ![[Pasted image 20260529112754.png]]

- 이전에 Go로 작성해둔게 있어서 옮겨버리기

```go
func climbStairs(n int) int {
	cache := make([]int, n + 1)
	cache[0] = 1
	cache[1] = 1
	for i := 2; i <= n; i++ {
		cache[i] = cache[i - 1] + cache[i - 2]
	}
	return cache[n]
}
```

### Java

> [!info]- 결과
> ![[Pasted image 20260529112955.png]]

- 이전에 Java로 작성해둔게 있어서 옮겨버리기

```java
class Solution {
	public int climbStairs(int n) {
		int[] cache = new int[n + 1];
		cache[0] = 1;
		cache[1] = 1;

		for (int idx = 2; idx <= n; idx++) {
			cache[idx] = cache[idx - 1] + cache[idx - 2];
		}

		return cache[n];
	}
}
```
