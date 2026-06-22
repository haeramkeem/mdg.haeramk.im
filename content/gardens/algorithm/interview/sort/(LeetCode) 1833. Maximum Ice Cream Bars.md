---
tags:
  - mdg
  - algorithm
  - interview/retry
  - sort
date: 2026-06-21
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/minimum-operations-to-make-a-uni-value-grid)

> [!tip] 요약
> - [[Counting Sort (Algorithm)|Counting Sort]] 사용해서 풀기

## 최종

> [!info]- 결과
> ![[Pasted image 20260621162251.png]]

- [[#std sort|이거]] 처럼 `std::sort` 사용할수도 있지만 문제의 조건에는 [[Counting Sort (Algorithm)|Counting Sort]] 를 사용하라고 되어 있기 때문에 그걸로 풀어보자.

```cpp
#define MAX(a, b) ((a) > (b) ? (a) : (b))

class Solution {
public:
	int maxIceCream(vector<int>& costs, int coins) {
		// 1. Get max cost
		int max_cost = 0;
		for (int cost : costs) {
			max_cost = MAX(max_cost, cost);
		}

		// 2. Get counting array
		vector<int> counting_arr(max_cost + 1, 0);
		for (int cost : costs) {
			counting_arr[cost]++;
		}

		// 3. Accumulate counting array
		for (int i = 1; i < max_cost + 1; i++) {
			counting_arr[i] += counting_arr[i - 1];
		}

		// 4. Do sort
		vector<int> sorted(costs.size());
		for (int cost : costs) {
			counting_arr[cost]--;
			sorted[counting_arr[cost]] = cost;
		}

		// 5. Count ice cream
		int cnt = 0;
		for (int cost : sorted) {
			if (cost <= coins) {
				coins -= cost;
				cnt++;
			}
		}

		return cnt;
	}
};
```

## 다른 풀이

### std::sort

> [!info]- 결과
> ![[Pasted image 20260621155252.png]]

> [!info]- 코드
> ```cpp
> class Solution {
> public:
> 	int maxIceCream(vector<int>& costs, int coins) {
> 		int cnt = 0;
>
> 		sort(costs.begin(), costs.end());
>
> 		for (int cost : costs) {
> 			if (cost <= coins) {
> 				coins -= cost;
> 				cnt++;
> 			} else {
> 				break;
> 			}
> 		}
>
> 		return cnt;
> 	}
> };
> ```

- [[#최종|위]] 에서 말한 것처럼, 이렇게 풀면 안된다. 하지만 그냥 sorting 으로 푸는게 맞는지 검증해보기 위해 `std::sort` 로 풀어보았다.
