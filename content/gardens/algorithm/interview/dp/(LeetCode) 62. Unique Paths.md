---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-07-12
aliases:
  - LeetCode 62
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/unique-paths)

> [!tip] 요약
> - Grid DP 의 근본문제.

## 최종

> [!info]- 결과
> ![[Pasted image 20260712094153.png]]

- [[(LeetCode) 1301. Number of Paths with Max Score|LeetCode 1301]] 처럼, 동서남북으로 움직이지 않는 grid 는 DP 를 사용하는게 정석이다.

```cpp
class Solution {
public:
	int uniquePaths(int m, int n) {
		vector<vector<int>> grid(m, vector<int>(n, 0));

		for (int ni = 0; ni < n; ni++) {
			grid[0][ni] = 1;
		}

		for (int mi = 1; mi < m; mi++) {
			grid[mi][0] = 1;

			for (int ni = 1; ni < n; ni++) {
				grid[mi][ni] = grid[mi][ni - 1] + grid[mi - 1][ni];
			}
		}

		return grid[m - 1][n - 1];
	}
};
```

## 다른 풀이

### Combination

> [!info]- 결과
> ![[Pasted image 20260712105746.png]]

> [!info]- 코드
> ```cpp
> class Solution {
> 	int combination(int n, int r) {
> 		unsigned long long acc = 1;
>
> 		// (n * ... * (r + 1)) / ((n - r) * ... * 1)
> 		// = (n / (n - r)) * ... * ((r + 1) / 1)
> 		for (int i = 1; i <= n - r; i++) {
> 			acc *= (r + i);
> 			acc /= i;
> 		}
>
> 		return acc;
> 	}
> public:
> 	int uniquePaths(int m, int n) {
> 		return combination(m + n - 2, m - 1);
> 	}
> };
> ```

- 시간복잡도나 메모리 사용량 등을 고려하면 이 풀이가 더 좋다. 하지만 이 풀이는 이 문제에만 적용되고 이와 유사한 문제를 푸는 일반적인 방법은 grid DP 이다.
- 어쨋든 이 풀이의 핵심은 오른쪽으로 하나 움직이는 operation (`r` 이라고 하자) 이랑 아래로 하나 움직이는 operation (`d` 이라고 하자) 의 조합의 개수이다.
	- 가령 오른쪽으로 쭉 움직인 뒤 아래로 쭉 움직이는 경로의 경우에는 `r, ..., r, d, ..., d` 로 표현할 수 있다.
	- 그리고 아래로 쭉 움직인 뒤 오른쪽으로 쭉 움직이는 경로의 경우에는 `d, ..., d, r, ..., r` 로 표현할 수 있다.
	- 이때 이 표현들의 총 개수를 구하면 된다. 근데 `r` operation 의 총 개수는 `n - 1` 이고, `d` operation 의 총 개수는 `m - 1` 이다.
	- 그럼 총 operation 의 개수는 `m + n - 2` 이고, 이 중에서 `n - 1` 개를 골라서 `r` 로 표시 (혹은 반대로 `m - 1` 개를 골라서 `d` 로 표시) 하는 방법의 개수가 정답이다.
	- 즉, 정답은 ${}^{m + n - 2} C_{m - 1}$ 이다.