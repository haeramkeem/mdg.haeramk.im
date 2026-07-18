---
tags:
  - mdg
  - algorithm
  - interview
  - subarray
date: 2026-07-18
aliases:
  - LeetCode 123
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii)

> [!tip] 요약
> - [[(LeetCode) 121. Best Time to Buy and Sell Stock|LeetCode 121]] 응용문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260718091202.png]]

- 전체 기간을 절반으로 나눠서 왼쪽에서의 최대 profit, 오른쪽에서의 최대 profit 을 구하고, 이 둘을 합한 값의 최대가 답이다.
- 그럼 왼쪽 오른쪽 나눠서 각각 [[(LeetCode) 121. Best Time to Buy and Sell Stock|LeetCode 121]] 을 때리면 되겠네? 라고 생각할 수 있는데 그렇게 하면 $O(n^2)$ 이어서 터진다.
- 근데 생각해보면 LeetCode 121 과정에서 왼쪽의 최대 profit 을 전부 구한다는 것을 알 수 있다. 다만 LeetCode 121 에서는 그것 각각을 memoize 하지 않는다는 것.
	- 그럼 vector 를 하나 만들어서 `i` 가 `1 ~ n-1` 로 전개될때 `0 ~ i` 구간의 최대 profit 을 전부 vector 에 넣어주면 모든 경우의 수에 대한 왼쪽의 profit 들은 다 구할 수 있다는 것을 알 수 있다.
- 그럼 이를 응용하면 오른쪽의 profit 도 전부 구할 수 있다는 것을 알 수 있다.
	- `i` 가 `n-2 ~ 0` 로 전개될 때 `i ~ n-1` 구간의 profit 을 비슷한 방식으로 구해서 또 다른 vector 에 넣을 수 있다.
- 그럼 결과적으로 두 vector 가 생성되는데, 첫번째 vector 의 index `i` 에는 `0 ~ i` 구간의 최대 profit 이 들어있고, 두번째 vector 의 index `i` 에는 `i ~ n-1` 구간의 최대 profit 이 들어있다.
- 그럼 이 두 vector 의 index `i` 에 해당하는 값 두개를 더한 값의 최대를 구해주면 정답이 된다.
- 다만 위의 방법으로 하면 $O(n)$ loop 을 3번 돌게 된다. 이걸 짱구를 잘 굴려서 loop 1번으로 압축시켜주면 다음과 같아진다:

```cpp
class Solution {
public:
	int maxProfit(vector<int>& prices) {
		int n = prices.size();

		// Forward
		int min_price = prices[0];
		vector<int> fwd_max(n, 0);

		// Backward
		int max_price = prices[n - 1];
		vector<int> bwd_max(n, 0);

		// Profit
		int max_profit = 0;

		for (int i = 1; i < n; i++) {
			// Forward
			fwd_max[i] = max(fwd_max[i - 1], prices[i] - min_price);
			min_price = min(min_price, prices[i]);

			// Backward
			bwd_max[n - i - 1] = max(bwd_max[n - i], max_price - prices[n - i - 1]);
			max_price = max(max_price, prices[n - i - 1]);

			// Profit
			max_profit = max(max_profit, fwd_max[i] + bwd_max[i]);
			max_profit = max(max_profit, fwd_max[n - i] + bwd_max[n - i]);
		}

		return max_profit;
	}
};
```
