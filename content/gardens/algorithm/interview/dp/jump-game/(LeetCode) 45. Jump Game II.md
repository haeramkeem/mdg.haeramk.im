---
tags:
  - mdg
  - algorithm
  - interview/retry
  - dp
  - jump-game
date: 2026-07-09
aliases:
  - LeetCode 45
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/jump-game-ii)

> [!tip] 요약
> - 발상의 전환을 해보자. 다만, 생각이 안나면 그냥 DP 나 BFS 로 풀면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260709093218.png]]

- 정답으로 '최소 몇번 jump 해야 하는지' 를 제출하면 되기 때문에, 'jump 한 횟수' 를 추적해주면 된다.
	- 그 말은, '어디서 jump 해야 할 지' 를 알아낼 필요는 없다는 것이다.
- 아래의 코드를 보자.

```cpp {16,18,22,23-24}
#define MAX(a, b) ((a) > (b) ? (a) : (b))

class Solution {
public:
	int jump(vector<int>& nums) {
		int n = nums.size();
		int jumps = 0;
		int reachable_cur_jumps = 0;
		int reachable_add_jump = 0;

		if (n == 1) {
			return 0;
		}

		for (int i = 0; i < n; i++) {
			reachable_add_jump = MAX(reachable_add_jump, i + nums[i]);

			if (reachable_add_jump >= n - 1) {
				return jumps + 1;
			}			

			if (i == reachable_cur_jumps) {
				jumps++;
				reachable_cur_jumps = reachable_add_jump;
			}
		}

		// Should not happen
		return -1;
	}
};
```

- 변수이름을 설명해보면
	- `jumps`: 현재까지 jump 한 횟수이다.
	- `reachable_cur_jumps`: 현재까지의 jump 횟수 (즉, `jumps`) 로 갈 수 있는 가장 먼 위치
	- `reachable_add_jump`: Jump 를 한번 더 했을 때 갈 수 있는 가장 먼 위치
- 처음부터 차근차근 생각해 보자.
	- 우선 나는 `i == 0` 에 있고, 이 위치가 현재 jump 횟수 (`jumps == 0`) 으로 가장 멀리 갈 수 있는 위치 (`reachable_cur_jumps == 0`) 이다.
	- `L16`: 지금 위치에서 jump 를 한번 한다면 닿을 수 있는 가장 먼곳은 `nums[0]` 이다 (즉, `0 + nums[0]`). 따라서 `reachable_add_jump` 를 `nums[0]` 로 업데이트해준다.
	- `L22`: 지금상태에서는 jump 를 하지 않으면 더 이상 갈 수 있는 곳이 없다 (`i == reachable_cur_jumps` 이므로).
	- `L23-L24`: 그래서 jump 를 한번 하고 (`jumps++`), 현재 jump 횟수로 갈 수 있는 가장 먼 거리 `reachable_cur_jumps` 를 jump 한번 했을 때 갈 수 있는 가장 먼 거리 (`reachable_add_jump`) 로 업데이트해준다.
	- 그다음에 `i == 1` 으로 옮긴다.
		- 이건 이렇게 생각해야 한다: `jumps` 번 jump 해서 갈 수 있는 곳의 범위는 `0` ~ `reachable_cur_jumps` 이다. 근데 방금 jump 를 한번 더 했고, 해당 범위가 늘어났으므로 `i == 1` 은 지금 `jump` 횟수로 갈 수 있는 선택지 중 하나이다. 그래서 방금의 jump 를 했을 때 그 선택지중 하나인 `i == 1` 로 갔다고 '가정했을 때' 라고 생각하면 된다.
	- `L16`: 지금 위치에서 jump 를 한번 한다면 닿을 수 있는 가장 먼곳은 `nums[0]` 이거나 `1 + nums[1]` 중에서 더 큰 값이다. 그래서 둘 중 더 큰 곳을 `reachable_add_jump` 로 업데이트해준다.
	- `L18`: 만약 `reachable_add_jump` 가 `n - 1` 보다 크거나 같다면, 추가적으로 한번만 더 jump 하면 종점으로 간다는 소리가 된다. 그래서 `jumps + 1` 을 return 한다.
	- 만약 `i(== 1) < reachable_cur_jumps` 라고 해보자. 그럼 `i == 2` 로 옮긴다.
		- 이것은 위에서 `i == 1` 로 옮길 때와 같은 상황이다. 즉, `i == 0` 에서 `i == 1` 로 jump 하지 않고 `i == 2` 로 jump 했다고 가정했을 때를 생각해보자는 거다.
	- 이런식으로 `i` 를 옮겨가다 보면 결국에는 `L18` 에 걸리게 된다. 그럼 끝.
- 기발한 풀이이긴 한데, 실전에서 이걸 생각해낼 수 있을지는 모르겠다.

## 다른 풀이

### DP 스러운 풀이

> [!info]- 결과
> ![[Pasted image 20260709093401.png]]

> [!info]- 코드
> ```cpp
> #define MAX_INT (0x7FFFFFFF)
> #define MIN(a, b) ((a) < (b) ? (a) : (b))
>
> class Solution {
> public:
> 	int jump(vector<int>& nums) {
> 		int n = nums.size();
> 		vector<int> dp(n, MAX_INT);
>
> 		dp[0] = 0;
>
> 		for (int i = 0; i < n; i++) {
> 			for (int j = 1; j <= nums[i] && i + j < n; j++) {
> 				dp[i + j] = MIN(dp[i + j], dp[i] + 1);
> 			}
> 		}
>
> 		return dp[n - 1];
> 	}
> };
> ```

- 문제가 DP 로 분류돼있어서 DP 스럽게 풀어봤다. 성능은 별로네.

## BFS

> [!info]- 결과
> ![[Pasted image 20260709093418.png]]

> [!info]- 코드
> ```cpp
> class Solution {
> public:
> 	int jump(vector<int>& nums) {
> 		int n = nums.size();
> 		vector<bool> visited(n, false);
> 		queue<int> q;
>
> 		visited[0] = true;
> 		q.push(0);
>
> 		while (!q.empty()) {
> 			int i = q.front();
> 			q.pop();
>
> 			if (i == n - 1) {
> 				return nums[i] >> 16;
> 			}
>
> 			for (int j = 1; j <= (nums[i] & 0xFFFF) && i + j < n; j++) {
> 				if (!visited[i + j]) {
> 					visited[i + j] = true;
> 					nums[i + j] |= ((nums[i] >> 16) + 1) << 16;
> 					q.push(i + j);
> 				}
> 			}
> 		}
>
> 		// Should not happen
> 		return 0;
> 	}
> };
> ```

- 위의 DP 보다 방문처리를 하는 BFS 가 좀 더 빠르지 않을까 해서 BFS 로 해봤는데 성능은 더 별로다.