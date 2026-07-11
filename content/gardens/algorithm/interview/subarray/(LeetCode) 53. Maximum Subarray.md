---
tags:
  - mdg
  - algorithm
  - interview
  - subarray
date: 2026-07-11
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/maximum-subarray)

> [!tip] 요약
> - 누적합을 생각하면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260711094216.png]]

- 누적합으로 풀어주면 된다.
	- `i` 부터 `j` 까지의 합 (`0 <= i <= j < n`) 을 `SUM[i,j]` 라고 하자. 이 문제는 모든 `i`, `j` 에 대해 `SUM[i,j]` 의 최대값을 찾는 문제다.
	- `SUM[i,j]` 는 누적합으로 바꾸면 `SUM[0,j] - SUM[0,i-1]` 가 된다.
	- 일단 `0 <= j < n` 인 어떤 `j` 에 대해 이 값이 최대가 되게 하려면 `0 <= i <= j` 모든 `i` 에 대해 `SUM[0,i-1]` 가 최소가 되어야 한다. `-1 <= i - 1 <= j - 1` 이므로 이 값을 `MINSUM[-1,j-1]` 라고 하자.
		- 즉, `MINSUM[-1,j-1]` 은 `SUM[0,-1], SUM[0,0], SUM[0,1], ..., SUM[0,j-1]` 값들의 최소값이다. 이때 `SUM[0,-1]` 은 '아무것도 누적되지 않은 상태' 이므로 덧셈의 항등원인 0이다.
	- 정리하면 `0 <= j < n` 인 어떤 `j` 에 대한 최대값은 `SUM[0,j] - MINSUM[-1,j-1]` 이라고 말할 수 있다. 따라서 문제의 정답은 모든 `j` 에 대한 `SUM[0,j] - MINSUM[-1,j-1]` 값들의 최대값이다.
- 이걸 기준으로 아래 코드를 보자.

```cpp
class Solution {
public:
	int maxSubArray(vector<int>& nums) {
		int cur_acc_sum = 0;
		int max_sub_sum = -10001;
		int min_acc_sum = 0;

		for (int num : nums) {
			cur_acc_sum += num;
			max_sub_sum = max(max_sub_sum, cur_acc_sum - min_acc_sum);
			min_acc_sum = min(min_acc_sum, cur_acc_sum);
		}

		return max_sub_sum;
	}
};
```

- 위에서 설명한 것을 이 코드와 접목시켜보면 다음과 같다.
	- 우선 변수 설명:
		- `cur_acc_sum` 은 `SUM[0,j]` 이다. 이놈의 초기값은 (현재는 아무것도 누적되지 않은 상태이기 때문에) 덧셈의 항등원인 0이다.
		- `min_acc_sum` 은 `MINSUM[-1,j-1]` 이다. 위에서 말한대로 `SUM[0,-1]` 은 덧셈의 항등원인 0이므로 이 값도 0으로 초기화된다.
		- `max_sum_sum` 은 `0 <= x <= j` 범위의 모든 `x` 에 대한 `SUM[0,x] - MINSUM[-1,x-1]` 값들의 최대값 이다.
	- 이때 loop 에서 뭐하는지를 보자.
		- `L9`: `cur_acc_sum` 에 `num` 을 누적한다. 즉, `SUM[0,j] = SUM[0,j-1] + nums[j]` 를 수행한 셈이다.
		- `L10` 를 보기 전에, 우선 `L11` 부터 보자. 여기서는 `min_acc_sum` 을 업데이트한다.
			- 지금까지는 `min_acc_sum` 이 `MINSUM[-1,j-1]` 였다. 이것은 `SUM[0,-1], ..., SUM[0,j-1]` 들의 최소값이다. 따라서 `MINSUM[-1,j-1]` 와 `SUM[0,j]` 중 최소값으로 `min_acc_sum` 을 업데이트해주면 이때 `min_acc_sum` 이 `MINSUM[-1,j]` 가 된다.
		- `L10` 에서는 `max_sum_sum` 을 업데이트한다.
			- 위에서 말한 대로 `L11` 에서 `min_acc_sum` 이 `MINSUM[-1,j]` 가 된다. 그렇다는건 `L10` 에서는 아직 `min_acc_sum` 이 `MINSUM[-1,j-1]` 이다.
				- 이 말은, `L10` 과 `L11` 의 ==순서를 바꾸면 안된다== 는 것이다.
				- `max_sum_sum` 의 업데이트는 반드시 `min_acc_sum` 의 업데이트 이전에 수행되어야 한다.
			- 따라서 `cur_acc_sum - min_acc_sum` 은 `SUM[0,j] - MIN[-1,j-1]` 와 같다. 이 값과 기존의 `max_acc_sum` 을 비교해 더 큰 값으로 업데이트해준다.