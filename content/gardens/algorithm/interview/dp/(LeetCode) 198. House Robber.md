---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-07-31
aliases:
  - LeetCode 198
  - LeetCode 198. House Robber
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/house-robber)

> [!tip] 요약
> - 1차원 DP

## 최종

> [!info]- 결과
> ![[Pasted image 20260731092557.png]]

- `dp[i]` 를 `nums[0:i]` 까지 털고 `nums[i]` 는 무조건 털었을 때의 최대값이라고 하자.
	- 그럼 `nums[i-1]` 은 무조건 못턴다.
	- `nums[i-2]` 는 털어볼만 하다. 이 값은 `dp[i-2]` 다.
	- 근데 `nums[i-2]` 를 털면 `nums[i-3]` 은 못턴다. 그래서 `nums[i-2]` 대신 `nums[i-3]` 을 털어볼 수 있다. 이 값은 `dp[i-3]` 이다.
		- `nums[i-3]` 를 털면 `nums[i-4]` 은 못턴다고 생각할 수 있지만, `nums[i-4]` 를 터는 시나리오는 이미 `dp[i-2]` 에 반영돼있다.
	- 그래서 `dp[i-2] + nums[i]`, `dp[i-3] + nums[i]` 중에 큰 값이 `dp[i]` 다.
- 그래서 아래처럼 풀면 된다.
	- 다만 `dp[i]` 에 대해 `dp[i-3]` 까지 접근하므로 `dp[]` 의 크기를 4로 줄일 수 있다.

```cpp
class Solution {
	array<int, 4> dp;
public:
	int rob(vector<int>& nums) {
		int n = nums.size();

		if (n == 1) {
			return nums[0];
		} else if (n == 2) {
			return max(nums[0], nums[1]);
		} else if (n == 3) {
			return max(nums[0] + nums[2], nums[1]);
		}

		int max_amount = max(nums[0] + nums[2], nums[1]);

		dp[0] = nums[0];
		dp[1] = nums[1];
		dp[2] = nums[0] + nums[2];

		for (int i = 3; i < n; i++) {
			int cur = i & 0x3;
			int prev_2 = (i - 2) & 0x3;
			int prev_3 = (i - 3) & 0x3;

			dp[cur] = max(dp[prev_2], dp[prev_3]) + nums[i];
			max_amount = max(max_amount, dp[cur]);
		}

		return max_amount;
	}
};
```

## 다른 풀이

### Recursion

> [!info]- 결과
> ![[Pasted image 20260731092525.png]]

> [!info]- 코드
> ```cpp
> class Solution {
> 	int N;
> 	vector<int> dp;
> 	int robImpl(const vector<int>& nums, const int& start) {
> 		if(start == N - 1) {
> 			return nums[start];
> 		} else if(start >= N) {
> 			return 0;
> 		} else if(dp[start] != INT_MIN) {
> 			return dp[start];
> 		}
> 		return dp[start] = max(robImpl(nums, start + 2) + nums[start], robImpl(nums, start + 3) + nums[start + 1]);
> 	}
> public:
> 	int rob(vector<int>& nums) {
> 		N = nums.size();
> 		dp.clear();
> 		dp.resize(N, INT_MIN);
> 		return robImpl(nums, 0);
> 	}
> };
> ```

- 옛날에 풀어둔 recursion 풀이.

### Java

> [!info]- 결과
> ![[Pasted image 20260731092501.png]]

> [!info]- 코드
> ```java
> class Solution {
> 	public int rob(int[] nums) {
> 		int len = nums.length;
> 		int max = -2147483648;
> 		for (int i = 0; i < len; i++) {
> 			int b = i > 0 ? nums[i - 1] : 0;
> 			int bb = i > 1 ? nums[i - 2] : 0;
> 			nums[i] = Math.max(b, bb + nums[i]);
> 			max = Math.max(max, nums[i]);
> 		}
> 		return max;
> 	}
> }
> ```

- 옛날에 풀어둔 java 풀이.