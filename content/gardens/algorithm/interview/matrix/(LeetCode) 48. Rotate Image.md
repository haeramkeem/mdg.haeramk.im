---
tags:
  - mdg
  - algorithm
  - interview
  - matrix
date: 2026-05-08
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/rotate-image)

> [!tip] 요약
> - 규칙찾기

## 최종

> [!info]- 결과
> ![[Pasted image 20260508201326.png]]

- 90도 회전할 때 각 좌표가 어떻게 바뀌는지 규칙을 찾고,
- 기존의 matrix 에 그대로 적용해야 하기 때문에 어떻게 iterate 하고 어떤 값을 buffering 할지를 잘 생각하면 된다.
	- [[index|주인장]]은 하나의 값을 90도 돌려서 움직이면 그 자리에 있던 값을 buffering 해두고 그 자리의 90도 위치에 있는 자리로 iterate 하는 방식으로 구현했다.

```cpp
class Solution {
public:
	void rotate(vector<vector<int>>& matrix) {
		int n = matrix.size();

		for (int i = 0; i < ((n + 1) >> 1); i++) {
			for (int j = i; j < (n - i - 1); j++) {
				int iter_i = i;
				int iter_j = j;
				int iter_buf = matrix[iter_i][iter_j];

				for (int x = 0; x < 4; x++) {
					int next_i = iter_j;
					int next_j = n - iter_i - 1;
					int next_buf = matrix[next_i][next_j];

					matrix[next_i][next_j] = iter_buf;

					iter_i = next_i;
					iter_j = next_j;
					iter_buf = next_buf;
				}
			}
		}
	}
};
```
