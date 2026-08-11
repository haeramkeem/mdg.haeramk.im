---
tags:
  - mdg
  - algorithm
  - interview
  - subarray
date: 2026-08-04
aliases:
  - LeetCode 188
  - LeetCode 188. Best Time to Buy and Sell Stock IV
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv)

> [!tip] 요약
> - [[(LeetCode) 122. Best Time to Buy and Sell Stock II|LeetCode 122]] 심화문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260804122801.png]]

- 어렵다기보단 복잡하다.
	1. [[롱, 숏 포지션 (자본시장)|롱]] 구간을 모두 찾는다.
	2. 구간의 개수가 `k` 보다 같거나 작으면 땡큐다.
	3. 만약에 그렇지 않으면, `k` 보다 같거나 작아질 때 까지 구간들을 `merge` 한다:
		- 어떤 인접한 두 구간을 `merge` 했을 때의 수익 감소액에 대해, 이 감소액이 최소가 되도록 하는 두 구간을 찾아 `merge` 한다.
		- 인접한 두 구간 A, B 를 `merge` 했을 때 가능한 경우의 수는 다음과 같다. 이 셋 중 최대값이 `merge` 한 구간의 최대 수익이 된다.
			1) A 를 버리는 경우
			2) B 를 버리는 경우
			3) A 의 시작시점에 매수해서, B 의 종료시점에 매도하는 경우
- 그래서 뭐 코드를 짜보면 다음과 같다:

```cpp
#define MAX_INT (0x7FFFFFFF)

class Long {
	int begin;
	int end;
	int next;
public:
	Long(int b, int e): begin(b), end(e), next(-1) {}

	int get_next() {
		return next;
	}

	void set_next(int n) {
		next = n;
	}

	int profit(vector<int>& prices) const {
		return prices[end] - prices[begin];
	}

	int merge_estimate(const Long &other, vector<int>& prices) const {
		int total = profit(prices) + other.profit(prices);
		int merge_profit = prices[other.end] - prices[begin];

		merge_profit = max(merge_profit, profit(prices));
		merge_profit = max(merge_profit, other.profit(prices));

		return total - merge_profit; // Cost
	}

	int merge(Long &other, vector<int>& prices) {
		int total = profit(prices) + other.profit(prices);
		int save_me = profit(prices);
		int connect = prices[other.end] - prices[begin];
		int save_other = other.profit(prices);
		int merge_profit;

		if (save_me >= connect && save_me >= save_other) {
			merge_profit = save_me;
		} else if (connect >= save_me && connect >= save_other) {
			merge_profit = connect;
			end = other.end;
		} else /* (save_other >= connect && save_other >= save_me) */ {
			merge_profit = save_other;
			begin = other.begin;
			end = other.end;
		}

		next = other.next;
		other.next = -1;

		return total - merge_profit; // Cost
	}
};

class LongList {
	vector<Long> data;
	int len = 0;
public:
	int size() {
		return len;
	}

	int fill(vector<int> &prices) {
		int n = prices.size();
		bool is_long = false;
		int begin = 0;
		int end = 0;
		int profit = 0;

		for (int i = 0; i < n - 1; i++) {
			if (prices[i] <= prices[i + 1]) {
				if (is_long) {
					end = i + 1;
				} else {
					begin = i;
					end = i + 1;
					is_long = true;
				}
			} else {
				if (is_long) {
					Long l(begin, end);
					profit += l.profit(prices);
					push(l);
					is_long = false;
				}
			}
		}

		if (is_long) {
			Long l(begin, end);
			profit += l.profit(prices);
			push(l);
		}

		return profit;
	}

	void push(Long &l) {
		if (!data.empty()) {
			data.back().set_next(data.size());
		}

		data.push_back(l);
		len++;
	}

	int merge(vector<int> &prices) {
		int it = 0;
		int min_cost = MAX_INT;
		int min_idx = -1;

		while (it != -1) {
			auto &cur = data[it];
			int next = cur.get_next();

			if (next != -1) {
				int cost = cur.merge_estimate(data[next], prices);

				if (min_cost > cost) {
					min_cost = cost;
					min_idx = it;
				}
			}

			it = next;
		}

		if (min_cost != MAX_INT) {
			auto &min = data[min_idx];
			int next = min.get_next();
			len--;
			return min.merge(data[next], prices);
		}

		// Should not happen
		return -1;
	}
};

class Solution {
public:
	int maxProfit(int k, vector<int>& prices) {
		LongList list;
		int profit = list.fill(prices);
		int merged = 0;

		while (k < list.size()) {
			profit -= list.merge(prices);
		}

		return profit;
	}
};
```
