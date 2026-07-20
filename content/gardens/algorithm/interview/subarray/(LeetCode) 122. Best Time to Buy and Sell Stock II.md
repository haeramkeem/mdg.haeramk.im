---
tags:
  - mdg
  - algorithm
  - interview
  - subarray
date: 2026-07-17
aliases:
  - LeetCode 122
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii)

> [!tip] 요약
> - 나도 내일의 주가를 미리 알고싶다

## 최종

> [!info]- 결과
> ![[Pasted image 20260717195512.png]]

- 내가 [[금융투자상품 (자본시장)|주식]] 이 망하는 이유는 내일의 가격을 모르기 때문이다.
- 근데 여기서는 가격을 아네? 그럼 개꿀이지. 내일 오르면 오늘 사고, 내일 내리면 오늘 팔면 된다.
- 를 좀 더 깔끔하게 코드로 옮겨보면 다음과 같다:

```cpp
class Solution {
public:
	int maxProfit(vector<int>& prices) {
		int min_i = 0;
		int total = 0;

		prices.push_back(0);

		for (int i = 1; i < prices.size(); i++) {
			if (prices[i - 1] > prices[i]) {
				total += prices[i - 1] - prices[min_i];
				min_i = i;
			}
		}

		return total;
	}
};
```
