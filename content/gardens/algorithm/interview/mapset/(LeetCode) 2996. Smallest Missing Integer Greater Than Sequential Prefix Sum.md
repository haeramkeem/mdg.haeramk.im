---
tags:
  - mdg
  - algorithm
  - interview
  - mapset
date: 2026-08-12
aliases:
  - LeetCode 2996
  - LeetCode 2996. Smallest Missing Integer Greater Than Sequential Prefix Sum
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/smallest-missing-integer-greater-than-sequential-prefix-sum)

> [!tip] 요약
> - 쉬운 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260812084500.png]]

- 그냥 prefix sum 을 구해준 다음 `nums` 에 등장하지 않고 prefix sum 보다 크거나 같은 애를 찾아주면 된다.
- `nums` 에 등장하는지는 [[Bitmap (Encoding)|BMS]] 사용했다.
- 이것들만 추가적으로 처리해주면 된다:
	1) `nums` 에 50 하나만 있는 경우는 정답이 51이므로 BMS 를 51까지 찾아준다.
	2) Prefix sum 이 50보다 큰 경우는 그 자체가 절대 `nums` 에 있지 않으므로 그게 정답이다.

```cpp
#define BMS unsigned long long

class Solution {
public:
	int missingInteger(vector<int>& nums) {
		int n = nums.size();
		int sum = nums[0];
		BMS set = 0;

		for (int i = 1; i < n; i++) {
			if (nums[i] == nums[i - 1] + 1) {
				sum += nums[i];
			} else {
				break;
			}
		}

		for (int num : nums) {
			set |= (1UL << num);
		}

		for (int i = sum; i <= 51; i++) {
			if (!((set >> i) & 0x1)) {
				return i;
			}
		}

		// `sum` is bigger than 50
		return sum;
	}
};
```
