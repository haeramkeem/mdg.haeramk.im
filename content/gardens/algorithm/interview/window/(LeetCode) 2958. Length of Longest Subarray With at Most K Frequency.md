---
tags:
  - mdg
  - algorithm
  - interview/retry
  - histogram
date: 2026-08-16
aliases:
  - LeetCode 2958
  - LeetCode 2958. Length of Longest Subarray With at Most K Frequency
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/length-of-longest-subarray-with-at-most-k-frequency)

> [!tip] 요약
> - Sliding Window

## 최종

> [!info]- 결과
> ![[Pasted image 20260816091547.png]]

- Histogram 을 사용한 다음 `k` 번을 초과한 character 가 나오면 window 의 왼쪽을 움직여주면 된다.
	- 이때 왼쪽을 움직일 때는 왼쪽 놈이 빠지게 되므로 해당 숫자에 대한 count 를 histogram 에서 빼주는 방식으로 하면 된다.

```cpp
class Solution {
public:
	int maxSubarrayLength(vector<int>& nums, int k) {
		int n = nums.size();
		unordered_map<int, int> histogram;
		int begin = 0;
		int max_len = 0;

		for (int i = 0; i < n; i++) {
			histogram[nums[i]]++;

			while (histogram[nums[i]] > k) {
				histogram[nums[begin]]--;
				begin++;
			}

			max_len = max(max_len, i - begin + 1);
		}

		return max_len;
	}
};
```

## 다른 풀이

### Queue

> [!info]- 결과
> ![[Pasted image 20260816090904.png]]

> [!info]- 코드
> ```cpp
> class Solution {
> public:
> 	int maxSubarrayLength(vector<int>& nums, int k) {
> 		int n = nums.size();
> 		unordered_map<int, queue<int>> occur;
> 		int begin = 0;
> 		int max_len = 0;
>
> 		for (int i = 0; i < n; i++) {
> 			if (occur.find(nums[i]) == occur.end()) {
> 				occur[nums[i]] = queue<int>();
> 			}
>
> 			auto &q = occur[nums[i]];
>
> 			if (q.size() == k) {
> 				int front = q.front();
> 				q.pop();
>
> 				if (begin <= front) {
> 					begin = front + 1;
> 				}
> 			}
>
> 			q.push(i);
>
> 			max_len = max(max_len, i - begin + 1);
> 		}
>
> 		return max_len;
> 	}
> };
> ```

- 처음에는 histogtram count 대신 queue 를 써서 `begin` 을 한번에 옮겼는데 이상하게 이게 더 느리다.