---
tags:
  - mdg
  - algorithm
  - interview
  - brute-force
date: 2026-04-08
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/xor-after-range-multiplication-queries-i)

> [!tip] 요약
> - 하라는대로 하면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260408100637.png]]

- 그냥 어떻게 하라고 문제에서 알려준다. 5분이면 푼다.

```cpp
#define Q_L (0)
#define Q_R (1)
#define Q_K (2)
#define Q_V (3)
#define MOD (1000000007)

class Solution {
public:
	int xorAfterQueries(vector<int>& nums, vector<vector<int>>& queries) {
		int ret = 0;

		for (auto &q : queries) {
			for (int idx = q[Q_L]; idx <= q[Q_R]; idx += q[Q_K]) {
				nums[idx] = ((long long)nums[idx] * q[Q_V]) % MOD;
			}
		}

		for (auto num : nums) {
			ret ^= num;
		}

		return ret;
	}
};
```

- 속도가 좀 구리긴 한데, 그냥 편차인듯; 저 `mod` 연산도 `if` 로 줄이고 XOR연산도 `accumulate()` 로 바꾸는 정답이 있던데, 별로 차이 안나는듯.