---
tags:
  - mdg
  - algorithm
  - interview/retry
  - dp
date: 2026-05-08
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/rotate-function)

> [!tip] 요약
> - 다음에 다시 풀어볼것

## 최종

> [!info]- 결과
> ![[Pasted image 20260508181655.png]]

- $F(k+1)$ 와 $F(k)$ 를 쭉 나열해보면 점화식을 짤 수 있겠다는게 눈에 보인다.
- 그걸 이용해 DP로 풀면 된다.

```cpp
#define MAX(a, b) ((a) > (b) ? (a) : (b))

class Solution {
public:
	int maxRotateFunction(vector<int>& nums) {
		int sum = 0;
		int m = nums.size() - 1;
		int fk = 0;
		int max;

		// Calc sum, F(0)
		for (int i = 0; i <= m; i++) {
			sum += nums[i];
			fk += i * nums[i];
		}
		max = fk;

		// Calc F(1) ~ F(m)
		for (int k = 1; k <= m; k++) {
			fk += sum - (m + 1) * nums[m - k + 1];
			max = MAX(max, fk);
		}

		return max;
	}
};
```

### 삽질기록

> [!info]- 코드
> ```cpp
> #define MAX(a, b) ((a) > (b) ? (a) : (b))
> #define MIN_I32 (0x80000000)
>
> class Solution {
> 	int rotateFunc(vector<int> &nums, int k) {
> 		int ret = 0;
> 		for (int i = 0; i < nums.size(); i++) {
> 			ret += i * nums[(nums.size() - k + i) % nums.size()];
> 		}
> 		return ret;
> 	}
> public:
> 	int maxRotateFunction(vector<int>& nums) {
> 		int max = MIN_I32;
> 		for (int i = 0; i < nums.size(); i++) {
> 			max = MAX(max, rotateFunc(nums, i));
> 		}
> 		return max;
> 	}
> };
> ```

- 혹시나 해서 brute force 로 해봤는데, 당연히 timeout 난다.