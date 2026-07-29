---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-07-29
aliases:
  - LeetCode 152
  - LeetCode 152. Maximum Product Subarray
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/maximum-product-subarray)

> [!tip] 요약
> - 쉬운 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260729122135.png]]

- 두개의 DP 를 생각해보자: `dp_max[i]`, `dp_min[i]`
	- 이때 `dp_max[i]` 는 index `i` 로 끝나는 subarray 의 최대 product 이고
	- `dp_min[i]` 은 index `i` 로 끝나는 subarray 의 최소 product 이다.
- 그럼 점화식은:
	- `dp_max[i]` 는 다음 셋 중에서 가장 큰 값이다.
		- `dp_max[i-1] * nums[i]`: 기존 최대값에 자신을 곱한 값
		- `dp_min[i-1] * nums[i]`: 기존 최소값에 자신을 곱한 값 - 이건 기존 최소값이 음수이고 자신도 음수일 때 양수가 되므로 최대값 후보가 된다.
		- `nums[i]`: 그냥 자기 자신
	- 마찬가지로 `dp_min[i]` 는 다음 셋 중에서 가장 작은 값이다.
		- `dp_max[i] * nums[i]` 기존 최대값에 자신을 곱한 값 - 이건 기존 최대값과 자신의 부호가 다를 경우 음수가 되므로 최소값 후보가 된다.
		- `dp_min[i] * nums[i]` 기존 최소값에 자신을 곱한 값 - 마찬가지로 기존 최소값과 자신의 부호가 다를 경우 음수가 되므로 최소값 후보가 된다.
		- `nums[i]`: 그냥 자기 자신
- 이렇게 해서 `dp_max[]` 의 최대값을 구해주면 된다.
- 근데 점화식을 보면 맨날 직전까지의 최대/최소를 사용하고 있는 것을 알 수 있다.
	- 그래서 `dp_max[i-1]` 은 `prev_max` 가,
	- `dp_min[i-1]` 은 `prev_min` 이 담당하도록 하면 메모리 사용량을 더 아낄 수 있다.

```cpp
#define MAX3(a, b, c) (max((max((a), (b))), (c)))
#define MIN3(a, b, c) (min((min((a), (b))), (c)))

class Solution {
public:
	int maxProduct(vector<int>& nums) {
		int n = nums.size();
		int prev_min = nums[0];
		int prev_max = nums[0];
		int max_prod = nums[0];

		for (int i = 1; i < n; i++) {
			int cur_min = MIN3(prev_min * nums[i], prev_max * nums[i], nums[i]);
			int cur_max = MAX3(prev_min * nums[i], prev_max * nums[i], nums[i]);

			max_prod = max(max_prod, cur_max);
			prev_min = cur_min;
			prev_max = cur_max;
		}

		return max_prod;
	}
};
```

## 다른 풀이

### Memoization

> [!info]- 결과
> ![[Pasted image 20260729122341.png]]

> [!info]- 코드
> ```cpp
> class Solution {
> 	vector<int> dpMin;
> 	vector<vector<int>> dpMax;
> 	int N;
> public:
> 	int maxProduct(vector<int>& nums) {
> 		N = nums.size();
> 		dpMin.clear();
> 		dpMax.clear();
>
> 		if(N == 1) {
> 			return nums[0];
> 		}
>
> 		dpMin.resize(N, INT_MAX);
> 		dpMax.resize(N, vector<int>(2, INT_MIN));
> 		return max(
> 			maxProductImpl(nums, 0, 1),
> 			maxProductImpl(nums, 0, 0)
> 		);
> 	}
>
> 	int maxProductImpl(vector<int>& nums, const int& start, const int& pickStart) {
> 		if(start == N - 1) { return pickStart == 1 ? nums[start] : INT_MIN; }
>
> 		if(dpMax[start][pickStart] == INT_MIN) {
> 			if(pickStart == 1) {
> 				dpMax[start][pickStart] = max(nums[start], nums[start] * (
> 					nums[start] < 0 ?
> 					minProductImpl(nums, start + 1) :
> 					maxProductImpl(nums, start + 1, 1)
> 				));
> 			} else {
> 				dpMax[start][pickStart] = max(
> 					maxProductImpl(nums, start + 1, 0),
> 					maxProductImpl(nums, start + 1, 1)
> 				);
> 			}
> 		}
>
> 		return dpMax[start][pickStart];
> 	}
>
> 	int minProductImpl(vector<int>& nums, const int& start) {
> 		if(start == N - 1) { return nums[start]; }
>
> 		if(dpMin[start] == INT_MAX) {
> 			dpMin[start] = min(nums[start], nums[start] * (
> 				nums[start] < 0 ?
> 				maxProductImpl(nums, start + 1, 1) :
> 				minProductImpl(nums, start + 1)
> 			));
> 		}
>
> 		return dpMin[start];
> 	}
> };
> ```

- 옛날에 푼 풀이인데 뭐 이상하게 풀어놔서 그냥 기록용으로만 남겨놓는다.

### Tabulation

> [!info]- 결과
> ![[Pasted image 20260729122444.png]]

> [!info]- 코드
> ```cpp
> class Solution {
> public:
> 	int maxProduct(vector<int>& nums) {
> 		int N = nums.size();
>
> 		vector<int> dpMin(N, INT_MAX);
> 		vector<vector<int>> dpMax(N, vector<int>(2, INT_MIN));
> 		dpMin[0] = nums[0];
> 		dpMax[0][1] = nums[0];
>
> 		int res = nums[0];
> 		for(size_t i = 1; i < nums.size(); i++) {
> 			dpMax[i][0] = max(dpMax[i - 1][0], dpMax[i - 1][1]);
> 			dpMax[i][1] = max(nums[i], nums[i] * (nums[i] < 0 ? dpMin[i - 1] : dpMax[i - 1][1]));
> 			dpMin[i] = min(nums[i], nums[i] * (nums[i] < 0 ? dpMax[i - 1][1] : dpMin[i  -1]));
> 			res = max(res, max(dpMax[i][0], dpMax[i][1]));
> 		}
>
> 		return res;
> 	}
> };
> ```

- 이것도 옛날에 푼 풀이인데 뭐 이상하게 풀어놔서 그냥 기록용으로만 남겨놓는다.