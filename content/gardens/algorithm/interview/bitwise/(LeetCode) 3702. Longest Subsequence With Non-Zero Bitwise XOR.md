---
tags:
  - mdg
  - algorithm
  - interview
  - bitwise
date: 2026-08-15
aliases:
  - LeetCode 3702
  - LeetCode 3702. Longest Subsequence With Non-Zero Bitwise XOR
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/longest-subsequence-with-non-zero-bitwise-xor)

> [!tip] 요약
> - 이게 되나 싶은게 정답이다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260815105730.png]]

- 뭐 이 문제를 DP 로 생각할 수도 있는데, 생각보다 단순하다.
- 만약에 모든 원소를 XOR 했을 때 0이 아니면, 그냥 `nums.length` 가 정답이다.
- 근데 0이라면, 다음의 두 경우가 있다.
	- 모든 원소가 0인 경우: 이때는 가능한 subsequence 가 없다. 따라서 0이 정답이다.
	- 0이 아닌 원소들의 XOR 이 0인 경우: 이때는 0이 아닌 원소 하나만 제외해주면 XOR 결과가 0이 아니게 된다. 그래서 정답은 `nums.length - 1` 이다.

```cpp
class Solution {
public:
	int longestSubsequence(vector<int>& nums) {
		int _xor = 0;
		int _or = 0;

		for (int num : nums) {
			_xor ^= num;
			_or |= num;
		}

		if (_xor) {
			return nums.size();
		}

		if (_or) {
			return nums.size() - 1;
		}

		return 0;
	}
};
```
