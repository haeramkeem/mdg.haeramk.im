---
tags:
  - mdg
  - algorithm
  - interview/retry
  - dp
date: 2026-08-01
aliases:
  - LeetCode 486
  - LeetCode 486. Predict the Winner
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/predict-the-winner)

> [!tip] 요약
> - 3차원 DP

## 최종

> [!info]- 결과
> ![[Pasted image 20260801211618.png]]

> [!tip] 나?
> - 아래 설명에서 '나' 는 player 1 이고 '너' 는 player 2 이다.

- 3차원 DP 를 이렇게 정의해보자 (`0 <= i <= j < n`).
	- `dp[i][j][0]` 는 `nums[i:j]` 범위에 대해, 내가 먼저 선택하는 경우 가져갈 수 있는 점수의 최대값이다.
	- `dp[i][j][1]` 는 `nums[i:j]` 범위에 대해, 내가 먼저 선택하지 ==않는== 경우 가져갈 수 있는 점수의 최대값이다.
- 그럼 이런 규칙을 찾을 수 있다.
	- 초기화 (`i == j`):
		- `dp[i][i][0]`: 내가 `nums[i]` 를 낼름 먹으면 된다. 그럼 `dp[i][i][0] == nums[i]` 다.
		- `dp[i][i][1]`: 너가 `nums[i]` 를 먹어버린다. 그럼 난 배가 고프다. 따라서 `dp[i][i][1] == 0` 이다.
	- 생성규칙 (`i < j`)
		- `dp[i][j][0]`: 이건 아래의 두가지 경우의 수 중 최대값이다.
			- 내가 `nums[i]` 를 먹는 경우: 그럼 남은 범위는 `nums[i+1:j]` 이고, 내가 먼저 선택하지 않는다. 따라서 `nums[i] + dp[i+1][j][1]` 이다.
			- 내가 `nums[j]` 를 먹는 경우: 그럼 남은 범위는 `nums[i][j-1]` 이고, 내가 먼저 선택하지 않는다. 따라서 `nums[j] + dp[i][j-1][1]` 이다.
		- `dp[i][j][1]`: 이건 너님이 먼저 선택하는 경우인데, 당연히 너님은 최대값이 되도록 하고싶을 테니 난 너님이 최대가 되도록 선택한 것들의 나머지 찌끄레기들을 먹을거다. 따라서 이건 `nums[i:j]` 범위의 총합에서 `dp[i][j][0]` 를 뺀 값이다.
- 이 규칙을 잘 보면 대각선으로 움직여야 한다는 것을 알 수 있다.
	- 뭔소리냐면 `dp[i][j][]` 를 각 cell 이 `int[2]` 인 2차원으로 생각했을 때,
	- `dp[i][j][]` 를 구하기 위해서는 왼쪽의 `dp[i][j-1][]` 와 아래의 `dp[i+1][j]` 가 필요하다는거다.
- 시각화해보면: 맨 처음에 대각선 방향 (`dp[0][0][]`, `dp[1][1][]`, ...) 을 초기화하는 것을 알 수 있다.
	- 아래 그림에서 `X` 는 사용 안하는 cell, `숫자` 는 cell 접근 순서, `?` 는 아직 값을 모르는 cell 이라고 해보자.

```
1 ? ? ?
X 2 ? ?
X X 3 ?
X X X 4
```

- 필요한 값이 왼쪽과 아래이기 때문에, 다음번에는 오른쪽으로 한칸 움직여서 대각선으로 구해주면 된다.

```
1 5 ? ?
X 2 6 ?
X X 3 7
X X X 4
```

- 이런식으로 하면 전체 접근 순서가 다음과 같다.

```
1 5 8 10
X 2 6 9
X X 3 7
X X X 4
```

- 이걸 구현해보면 다음과 같다.
	- 여기서 `acc` 는 누적합으로, `nums[i:j]` 구간의 총합을 빠르게 구하기 위함이다.

```cpp
#define SUM(acc, l, r) ((acc)[(r) + 1] - (acc)[(l)])

class Solution {
	array<array<array<int, 2>, 20>, 20> dp;
	array<int, 21> acc;
public:
	bool predictTheWinner(vector<int>& nums) {
		int n = nums.size();

		acc[0] = 0;
		for (int i = 0; i < n; i++) {
			acc[i + 1] = acc[i] + nums[i];
			dp[i][i][0] = nums[i];
			dp[i][i][1] = 0;
		}

		for (int x = 1; x < n; x++) {
			for (int i = 0; i + x < n; i++) {
				int j = i + x;
				int take_i = nums[i] + dp[i + 1][j][1];
				int take_j = nums[j] + dp[i][j - 1][1];
				dp[i][j][0] = max(take_i, take_j);
				dp[i][j][1] = SUM(acc, i, j) - dp[i][j][0];
			}
		}

		return dp[0][n - 1][0] >= dp[0][n - 1][1];
	}
};
```
