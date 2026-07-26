---
tags:
  - mdg
  - algorithm
  - interview
  - bitwise
date: 2026-07-24
aliases:
  - LeetCode 3514
  - LeetCode 3514. Number of Unique XOR Triplets II
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/number-of-unique-xor-triplets-ii)

> [!tip] 요약
> - [[(LeetCode) 3513. Number of Unique XOR Triplets I|LeetCode 3513]] 응용문제.

## 최종

> [!info]- 결과
> ![[Pasted image 20260724104623.png]]

- 보면 값의 범위가 최대 1500까지다.
- 그럼 [[(LeetCode) 3513. Number of Unique XOR Triplets I|LeetCode 3513]] 에서를 생각해보면, XOR 결과는 절대로 2048을 넘을 수 없다.
- 그래서 2048짜리 array 를 만든 후, 한번 XOR 한 결과를 여기에 모두 flag 를 쳐놓고 그 flag 가 있는놈들이랑 한번 더 XOR 를 하면 결과가 나온다.

```cpp
class Solution {
public:
	int uniqueXorTriplets(vector<int>& nums) {
		int n = nums.size();
		char cnt[2048] = {0};
		int ret = 0;

		for (int i = 0; i < n; i++) {
			for (int j = i; j < n; j++) {
				cnt[nums[i] ^ nums[j]] |= 0x1;
			}
		}

		for (int i = 0; i < 2048; i++) {
			if (cnt[i] & 0x1) {
				for (int num : nums) {
					cnt[i ^ num] |= 0x2;
				}
			}
		}

		for (int i = 0; i < 2048; i++) {
			ret += (cnt[i] >> 1);
		}

		return ret;
	}
};
```
