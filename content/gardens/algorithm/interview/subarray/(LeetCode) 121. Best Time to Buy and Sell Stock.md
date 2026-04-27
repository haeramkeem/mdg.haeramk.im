---
tags:
  - mdg
  - algorithm
  - interview
  - subarray
date: 2026-04-04
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/best-time-to-buy-and-sell-stock)

> [!tip] 요약
> - 다음에 다시 한번 풀어봐야할듯

## 최종

> [!info]- 결과
> ![[Pasted image 20260404195340.png]]

- 간단하다. Index 1 부터 iterate 하면서 최소 매수 가격을 조정하고, 최소 매수 가격과 현재 가격 차이를 이용해 최대 수익을 조정하면 된다.
- 사실 이 풀이가 너무 간단해서 잘 생각하지 못하는 것 같다. 뭔가 edge case가 있을 것 같고, 그래서 코드를 수정하다보면 계속 미궁으로 빠지게 된다.
- 그래서 코드는:

```cpp
#define MAX(a, b) (a > b ? a : b)

class Solution {
public:
	int maxProfit(vector<int>& prices) {
		int buy_price = prices[0];
		int profit = 0;

		for (int i = 1; i < prices.size(); i++) {
			if (buy_price > prices[i]) {
				buy_price = prices[i];
			}

			profit = MAX(profit, prices[i] - buy_price);
		}

		return profit;
	}
};
```

### 삽질 기록

> [!info]- 코드
> ```cpp
> #define MIN_I32 (0x80000000)
> #define MAX_I32 (0x7FFFFFFF)
>
> class Solution {
> public:
> 	int maxProfit(vector<int>& prices) {
> 		int max = MIN_I32;
> 		int max_idx = 0;
> 		int min = MAX_I32;
> 		int min_idx = 0;
> 		int ret = 0;
>
> 		for (int i = 1; i < prices.size(); i++) {
> 			if (prices[i] - prices[0] >= max) {
> 				max = prices[i] - prices[0];
> 				max_idx = i;
> 			}
> 		}
>
> 		for (int i = 1; i < max_idx; i++) {
> 			if (prices[i] - prices[0] < min) {
> 				min = prices[i] - prices[0];
> 				min_idx = i;
> 			}
> 		}
>
> 		if (ret < max) {
> 			ret = max;
> 		}
>
> 		if (ret < prices[max_idx] - prices[min_idx]) {
> 			ret = prices[max_idx] - prices[min_idx];
> 		}
>
> 		return ret;
> 	}
> };
> ```

- 처음에 시도한 것.
	- 첫날 매수를 했을 때 최대 수익이 나는 매도타임을 찾고, 반대로 최소 수익이 나는 매도타임을 찾으면 그 둘간의 차이가 첫날 매수하지 않았을 때의 최대 수익이 날 것이라 생각했다.
	- 이렇게 해서 어찌저찌 풀 수는 있을텐데, 결과적으로 너무 쓸데없이 깊게 생각해서 꼬인듯

## 다른 풀이 (Go)

> [!info]- 결과
> ![[Pasted image 20260422102142.png]]

> [!info]- 코드
> ```go
> func maxProfit(prices []int) int {
> 	// min := prices[0]
> 	// But use proces[0] instead to store minimum value for optimization
> 	profit := 0
>
> 	for i := 1; i < len(prices); i++ {
> 		if prices[0] > prices[i] {
> 			prices[0] = prices[i]
> 		} else if profit < prices[i] - prices[0] {
> 			profit = prices[i] - prices[0]
> 		}
> 	}
>
> 	return profit
> }
> ```

- 이전에 Go 로 푼 풀이가 있어서 여기로 옮기기