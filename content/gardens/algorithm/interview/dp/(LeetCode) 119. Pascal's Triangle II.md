---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-04-04
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/pascals-triangle-ii)

> [!tip] 요약
> - 메모리를 최대한 적게쓰는 방법을 생각해보자.

## 최종

> [!info]- 결과
> ![[Pasted image 20260404170355.png]]

- Vector 두개 두고 double buffering 처럼 해도 되지만,
- 각 row 를 계산할 때 어떤 값이 invalidate 되어도 되는지 생각해보면 그냥 vector 하나로도 해결이 된다.
- 그래서 코드는:

```cpp
class Solution {
public:
	vector<int> getRow(int rowIndex) {
		vector<int> ret = {1};

		for (int i = 1; i <= rowIndex; i++) {
			for (int j = i - 1; j > 0; j--) {
				ret[j] += ret[j - 1];
			}
			ret.push_back(1);
		}

		return ret;
	}
};
```

## Go

> [!info]- 결과
> ![[Pasted image 20260404170522.png]]

- 이전에 Go로 작성해둔게 있어서 옮겨버리기

```go
func getRow(rowIndex int) []int {
	cache := []int{1}

	for i := 1; i <= rowIndex; i++ {
		level := make([]int, i + 1)
		level[0] = 1
		level[i] = 1

		for j := 1; j < i; j++ {
			level[j] = cache[j - 1] + cache[j]
		}

		cache = level
	}

	return cache
}
```
