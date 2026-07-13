---
tags:
  - mdg
  - algorithm
  - interview
  - dp
  - jump-game
date: 2026-07-09
aliases:
  - LeetCode 55
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/jump-game)

> [!tip] 요약
> - [[(LeetCode) 45. Jump Game II|LeetCode 45]] 와 같은 문제.

## 최종

> [!info]- 결과
> ![[Pasted image 20260709110106.png]]

- [[(LeetCode) 45. Jump Game II|LeetCode 45]] 와 동일하게 풀어주면 된다.
	- 한가지 차이점이라면, `i` 가 움직일 수 있는 범위를 `reachable_cur_jumps` 로 제한해두었다 (`L16`).
		- `L23-L26` 에서 `reachable_cur_jumps` 를 `reachable_add_jump` 로 업데이트했음에도 불구하고 `i == reachable_cur_jumps` 가 유지된다면, 추가적인 jump 를 해도 앞으로 나아가지 못하는 것을 의미한다.
		- 따라서 이때는 `for` loop 을 빠져나오게 되고 종점에 도달할 수 없다고 판단하게 된다.
	- 사실 LeetCode 45 도 동일하게 해줘도 된다. 해당 문제에서는 무조건 종점에 도달하도록 test case 가 제공된다고 적혀있기 때문.

```cpp {16,23-26}
#define MAX(a, b) ((a) > (b) ? (a) : (b))

class Solution {
public:
	bool canJump(vector<int>& nums) {
		int n = nums.size();

		if (n == 1) {
			return true;
		}

		int jumps = 0;
		int reachable_cur_jumps = 0;
		int reachable_add_jump = 0;

		for (int i = 0; i <= reachable_cur_jumps; i++) {
			reachable_add_jump = MAX(reachable_add_jump, i + nums[i]);

			if (reachable_add_jump >= n - 1) {
				return true;
			}

			if (i == reachable_cur_jumps) {
				jumps++;
				reachable_cur_jumps = reachable_add_jump;
			}
		}

		return false;
	}
};
```