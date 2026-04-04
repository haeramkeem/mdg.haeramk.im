---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-04-04
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/pascals-triangle)

> [!tip] 요약
> - 하라는대로 하면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260404165154.png]]

- 그냥 이전 row를 보면서 새로운 row를 만들면 된다.

```cpp
class Solution {
public:
	vector<vector<int>> generate(int numRows) {
		vector<vector<int>> ret = {{1}, {1, 1}};

		if (numRows == 1) {
			return {{1}};
		}

		for (int i = 3; i <= numRows; i++) {
			vector<int> &last = ret.back();
			vector<int> new_row(i, 1);

			for (int j = 1; j < i - 1; j++) {
				new_row[j] = last[j - 1] + last[j];
			}

			ret.push_back(new_row);
		}

		return ret;
	}
};
```

## Go

> [!info]- 결과
> ![[Pasted image 20260404165253.png]]

- 이전에 Go로 작성해둔게 있어서 옮겨버리기

```go
func generate(numRows int) [][]int {
	outp := make([][]int, numRows)
	outp[0] = []int{1}

	for i := 1; i < numRows; i++ {
		level := make([]int, i + 1)
		level[0] = 1
		level[i] = 1

		for j := 1; j < i; j++ {
			level[j] = outp[i - 1][j - 1] + outp[i - 1][j]
		}

		outp[i] = level
	}

	return outp
}
```
