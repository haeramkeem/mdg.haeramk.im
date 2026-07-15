---
tags:
  - mdg
  - algorithm
  - interview/retry
  - dp
date: 2026-07-15
aliases:
  - LeetCode 85
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/maximal-rectangle)

> [!tip] 요약
> - 나중에 다시 풀어보기

## 최종

> [!info]- 결과
> ![[Pasted image 20260715111255.png]]

- 더 빠른 풀이가 있는거같긴한데, 일단은 이정도로 만족.
- 아이디어는 `matrix[i][j]` 가 직사각형의 오른쪽 아래 꼭지점이 되게 하는 직사각형의 최대 크기를 구해나가는 것이다.
- 이를 위해서는 `dp[i][j]` 에 이놈 위에 몇개의 1이 있냐를 저장하면 된다.
	- 즉, `matrix[i][j]` 가 `'1'` 이라면 이놈은 `dp[i - 1][j] + 1` 이다.
- 그럼 저 `dp` 로 어떻게 구하냐:
	- `0 <= x <= j` 인 `x` 를 하나 잡아보자.
	- 이때 `matrix[i][x]` 를 직사각형의 왼쪽 아래 꼭지점이 되게하는 직사각형의 높이는 `x ~ j` 범위에서의 `dp[i][*]` 의 최소값이다.
- 그래서 코드는:

```cpp {24-27}
#define MAX_INT (0x7FFFFFFF)

class Solution {
public:
	int maximalRectangle(vector<vector<char>>& matrix) {
		int rows = matrix.size();
		int cols = matrix[0].size();
		int max_area = 0;

		if (rows == 1 && cols == 1) {
			return matrix[0][0] - '0';
		}

		for (int r = 0; r < rows; r++) {
			for (int c = 0; c < cols; c++) {
				int min_height = MAX_INT;

				matrix[r][c] -= '0';

				if (0 < r && matrix[r][c]) {
					matrix[r][c] += matrix[r - 1][c];
				}

				for (int _c = c; 0 <= _c && matrix[r][_c]; _c--) {
					min_height = min(min_height, 0xFF & matrix[r][_c]);
					max_area = max(max_area, (c - _c + 1) * min_height);
				}
			}
		}

		return max_area;
	}
};
```

- 여기서 깜찍한 최적화가 하나 들어갔다.
	- `dp[i][j]` 를 `matrix[i][j]` 의 '위' 에 있는 1의 개수라고 했다.
	- 근데 '위' 가 아니라 '왼쪽' 에 있는 1의 개수로 삼아도 문제풀이가 가능하다.
		- 즉, 이렇게 되면 `dp[i][j] = dp[i][j - 1] + 1` (물론 `matrix[i][j] == '1'` 일 때) 가 된다.
	- 근데 왜 굳이 '왼쪽' 이 아니라 '위' 를 해야 할까?
	- 그건 [[Locality (Replacement)|Spatial locality]] 때문이다. 코드를 보면 `L24-L27` 에서 왼쪽방향으로 직사각형을 넓히며 높이의 최소값을 업데이트하고 직사각형 넓이를 구해나가는 것을 알 수 있다.
	- 근데 만약 `dp` 가 추적하는 방향이 '위'가 아니라 '왼쪽'이 된다면 `L24-L27` 에서는 반대로 위쪽방향으로 직사각형을 넓혀야 한다.
	- 근데 위쪽으로 움직이는건 cache [[Locality (Replacement)|locality]] 관점에서 불리하다. 왼쪽으로 움직이는건 sequential access 지만, 위쪽으로 움직이는건 random access 이기 때문.
	- 뭐 편차일수도 있겠지만 이걸 해주면 10ms 정도 빨라진다.

## 다른 풀이

### Brute force

> [!info]- 결과
> ![[Pasted image 20260715094146.png]]

> [!info]- 코드
> ```cpp
> #define MAX_INT (0x7FFFFFFF)
>
> class Solution {
> public:
> 	int maximalRectangle(vector<vector<char>>& matrix) {
> 		int rows = matrix.size();
> 		int cols = matrix[0].size();
> 		int max_area = 0;
>
> 		for (int r = 0; r < rows; r++) {
> 			for (int c = 0; c < cols; c++) {
> 				if (matrix[r][c] > '0') {
> 					int min_width = MAX_INT;
>
> 					for (int _r = r; _r < rows && matrix[_r][c] > '0'; _r++) {
> 						int _c = c;
>
> 						for (int i = c + 1; i < cols; i++) {
> 							if (matrix[_r][i] == '0') {
> 								break;
> 							}
> 							_c = i;
> 						}
>
> 						min_width = min(min_width, _c - c + 1);
> 						max_area = max(max_area, (_r - r + 1) * min_width);
> 					}
> 				}
> 			}
> 		}
>
> 		return max_area;
> 	}
> };
> ```

- 무지성 brute force 풀이. 당연히 느리다.