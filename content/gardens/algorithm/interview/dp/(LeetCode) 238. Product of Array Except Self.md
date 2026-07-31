---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-07-31
aliases:
  - LeetCode 238
  - LeetCode 238. Product of Array Except Self
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/product-of-array-except-self)

> [!tip] 요약
> - Prefix/Suffix DP

## 최종

> [!info]- 결과
> ![[Pasted image 20260731105406.png]]

- DP 두개를 생각해보자.
	- `dp_lr[i]` 은 `nums[0:i-1]` 까지의 곱이다.
		- 따라서 `dp_lr[i]` 은 `dp_lr[i-1] * nums[i-1]` 이다.
	- `dp_rl[i]` 은 `nums[i+1:n-1]` 까지의 곱이다.
		- 따라서 `dp_rl[i]` 은 `dp_rl[i+1] * nums[i+1]` 이다.
	- 그럼 결과값 `ret[i]` 은 `dp_lr[i] * dp_rl[i]` 이다.
- `dp_lr` 이랑 `dp_rl` 모두 바로 옆의 값을 쓰므로 변수 하나 (각각 `lr_acc`, `rl_acc`) 로 바꿔보면 코드는 다음과 같아진다:

```cpp
class Solution {
public:
	vector<int> productExceptSelf(vector<int>& nums) {
		int n = nums.size();
		vector<int> ret(n, 1);
		int lr_acc = 1;
		int rl_acc = 1;

		for (int i = 1; i < n; i++) {
			lr_acc *= nums[i - 1];
			ret[i] *= lr_acc;
			rl_acc *= nums[n - i];
			ret[n - i - 1] *= rl_acc;
		}

		return ret;
	}
};
```
