---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-04-03
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/maximum-amount-of-money-robot-can-earn)

> [!tip] 요약
> - 모르겠다 싶으면 DP 를 고려해보자.

## 최종

> [!info]- 결과
> ![[Pasted image 20260403160555.png]]

- 3차원 DP를 사용하면 된다.
	- `dp[x][y][k]` 는 `(x, y)` 좌표에 neutralize 를 `k` 번 썼을 때의 최대 coin 이다.
- 코드를 보자:

```cpp {22-35}
#define MAX(a, b) (a > b ? a : b)
#define MAX3(a, b, c) (MAX(MAX(a, b), c))
#define MAX4(a, b, c, d) (MAX(MAX(a, b), MAX(c, d)))

class Solution {
public:
	int maximumAmount(vector<vector<int>>& coins) {
		int x_max = coins.size();
		int y_max = coins[0].size();
		auto dp = vector<vector<vector<int>>>(x_max, vector<vector<int>>(y_max, vector<int>(3, 0)));

		for (int x = 0; x < x_max; x++) {
			for (int y = 0; y < y_max; y++) {
				if (coins[x][y] < 0) {
					if (x == 0 && y == 0) {
						dp[x][y][0] = coins[x][y];
						dp[x][y][1] = 0;
						dp[x][y][2] = 0;
					}

					else if (x > 0 && y > 0) {
						dp[x][y][0] = MAX(dp[x - 1][y][0] + coins[x][y], dp[x][y - 1][0] + coins[x][y]);

						dp[x][y][1] = MAX4(dp[x - 1][y][1] + coins[x][y],
						                   dp[x][y - 1][1] + coins[x][y],
						                   dp[x - 1][y][0],
						                   dp[x][y - 1][0]);

						dp[x][y][2] = MAX4(dp[x - 1][y][2] + coins[x][y],
						                   dp[x][y - 1][2] + coins[x][y],
						                   dp[x - 1][y][1],
						                   dp[x][y - 1][1]);
					}

					// right
					else if (x > 0) {
						dp[x][y][0] = dp[x - 1][y][0] + coins[x][y];

						dp[x][y][1] = MAX(dp[x - 1][y][1] + coins[x][y],
						                  dp[x - 1][y][0]);

						dp[x][y][2] = MAX(dp[x - 1][y][2] + coins[x][y],
						                  dp[x - 1][y][1]);
					}

					// down
					else if (y > 0) {
						dp[x][y][0] = dp[x][y - 1][0] + coins[x][y];

						dp[x][y][1] = MAX(dp[x][y - 1][1] + coins[x][y],
						                  dp[x][y - 1][0]);

						dp[x][y][2] = MAX(dp[x][y - 1][2] + coins[x][y],
						                  dp[x][y - 1][1]);
					}
				}

				else {
					if (x == 0 && y == 0) {
						dp[x][y][0] = coins[x][y];
						dp[x][y][1] = coins[x][y];
						dp[x][y][2] = coins[x][y];
					}

					else if (x > 0 && y > 0) {
						dp[x][y][0] = MAX(dp[x - 1][y][0] + coins[x][y], dp[x][y - 1][0] + coins[x][y]);
						dp[x][y][1] = MAX(dp[x - 1][y][1] + coins[x][y], dp[x][y - 1][1] + coins[x][y]);
						dp[x][y][2] = MAX(dp[x - 1][y][2] + coins[x][y], dp[x][y - 1][2] + coins[x][y]);
					}

					// right
					else if (x > 0) {
						dp[x][y][0] = dp[x - 1][y][0] + coins[x][y];
						dp[x][y][1] = dp[x - 1][y][1] + coins[x][y];
						dp[x][y][2] = dp[x - 1][y][2] + coins[x][y];
					}

					// down
					else if (y > 0) {
						dp[x][y][0] = dp[x][y - 1][0] + coins[x][y];
						dp[x][y][1] = dp[x][y - 1][1] + coins[x][y];
						dp[x][y][2] = dp[x][y - 1][2] + coins[x][y];
					}
				}
			}
		}

		return MAX3(dp[x_max - 1][y_max - 1][0],
		            dp[x_max - 1][y_max - 1][1],
		            dp[x_max - 1][y_max - 1][2]);
	}
};
```

- Highlight 된 코드 (L22-35) 가 핵심이다.
	- `dp[x][y][0]` 은 그냥 위/왼쪽의 값중에 큰것을 선택하면 된다.
	- `dp[x][y][1]` 은 2가지의 경우의 수가 있다.
		- 만약 여기서 neutralize 를 안하는 경우라면, `k=1` 일 때의 위/왼쪽이 후보가 된다.
		- 하지만 여기서 neutralize 를 하는 경우라면, `k=0` 일 때의 위/왼쪽이 후보가 된다.
		- 즉, 이렇게 각 경우마다의 총 4개의 후보 중에 큰 값을 고르면 된다.
	- 마찬가지의 방식으로 `dp[x][y][2]` 도 계산할 수 있다.

## 삽질 기록

### 1. DFS

> [!info]- 코드
> ```cpp
> class Solution {
> private:
> 	int max_coins;
> 	void move(vector<vector<int>>& coins, int pos_x, int pos_y, vector<int>& path) {
> 		path.push_back(coins[pos_x][pos_y]);
> 
> 		if (pos_x < coins.size() - 1) {
> 			move(coins, pos_x + 1, pos_y, path);
> 		}
> 
> 		if (pos_y < coins[0].size() - 1) {
> 			move(coins, pos_x, pos_y + 1, path);
> 		}
> 
> 		if (pos_x == coins.size() - 1 && pos_y == coins[0].size() - 1) {
> 			int total = 0;
> 			vector<int> robber;
> 
> 			for (auto coin : path) {
> 				if (coin < 0)
> 					robber.push_back(coin);
> 				else
> 					total += coin;
> 			}
> 
> 			sort(robber.begin(), robber.end());
> 
> 			if (robber.size() > 0) {
> 				robber[0] = 0;
> 			}
> 
> 			if (robber.size() > 1) {
> 				robber[1] = 0;
> 			}
> 
> 			for (auto robbed : robber) {
> 				total += robbed;
> 			}
> 
> 			max_coins = max_coins < total ? total : max_coins;
> 		}
> 
> 		path.pop_back();
> 	}
> public:
> 	int maximumAmount(vector<vector<int>>& coins) {
> 		vector<int> path;
> 		max_coins = -1000000;
> 		move(coins, 0, 0, path);
> 		return max_coins;
> 	}
> };
> ```

- 문제를 처음 봤을때 딱 드는 생각은 DFS 이다. 이건 뭐 greedy 하게도 안되고 결국에는 모든 경우의 수를 살펴봐야 하기 때문.
- 하지만 위 코드를 돌려보면 timeout 이 난다.