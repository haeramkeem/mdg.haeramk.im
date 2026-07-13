---
tags:
  - mdg
  - algorithm
  - interview
  - sort
date: 2026-07-07
aliases:
  - LeetCode 1288
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/remove-covered-intervals)

> [!tip] 요약
> - 어떻게 정렬할지 생각해보자.

## 최종

> [!info]- 결과
> ![[Pasted image 20260707101559.png]]

- 이렇게 정렬해보자:
	- 두 interval 에 대해 시작지점이 다르다면 시작지점이 작은 놈을 먼저,
	- 같다면 종료지점이 큰 놈을 먼저.
- 정렬하고 나면 임의의 index `i` 에대해:
	- `j < i` 인 모든 `intervals[j]` 들은 `intervals[i]` 에 비해 (1) 시작지점이 작던가, (2) 시작지점이 같지만 종료지점이 크던가 이다.
		- 시작지점과 종료지점이 모두 같을 수는 없다. 모든 interval 은 unique 하기 때문.
	- 그럼 반대로 말해보면, `i < x` 인 모든 `intervals[x]` 는 `intervals[i]` 에 비해 (1) 시작지점이 크거나 (2) 시작지점이 같지만 종료지점이 작거나 이다.
		- 즉, 어떤 `x` 에 대해서도 `intervals[x]` 는 `intervals[i]` 를 cover 할 수 없다.
	- 따라서 우리는 `intervals[i]` 를 cover 할 수 있는 `intervals[j]` 가 존재하는지 확인한다면 이놈이 cover 되는지 안되는지를 판단할 수 있다.
	- 이것은 딱 하나만 추적하면 된다: `0 ~ (i - 1)` 범위의 interval 들에 대한 종료지점의 최대값.
		- 만약 이 최대값이 `intervals[i]` 보다 크거나 같다면, 이놈은 cover 된다.
		- 반대로 말하면, 이 최대값이 `intervals[i]` 보다 작다면 이놈은 cover 되지 않고 살아남는다. 이런 놈들의 개수를 세어 주면 정답이다.
- 그래서 코드는:

```cpp
#define MAX(a, b) ((a) > (b) ? (a) : (b))

class Solution {
public:
	int removeCoveredIntervals(vector<vector<int>>& intervals) {
		sort(intervals.begin(), intervals.end(), [](auto &a, auto &b) {
			if (a[0] == b[0]) {
				return a[1] > b[1];
			}
			return a[0] < b[0];
		});

		int cnt = 0;
		int max_end = -1;
		for (auto &i : intervals) {
			if (max_end < i[1]) {
				cnt++;
				max_end = i[1];
			}
		}

		return cnt;
	}
};
```

## 다른 풀이

### Brute force

> [!info]- 결과
> ![[Pasted image 20260707095553.png]]

> [!info]- 코드
> ```cpp
> class Solution {
> public:
> 	int removeCoveredIntervals(vector<vector<int>>& intervals) {
> 		int n = intervals.size();
> 		int cnt = n;
>
> 		for (int i = 0; i < n; i++) {
> 			for (int j = 0; j < n; j++) {
> 				if (i == j) {
> 					continue;
> 				}
>
> 				int a = intervals[i][0];
> 				int b = intervals[i][1];
> 				int c = intervals[j][0];
> 				int d = intervals[j][1];
>
> 				if (c <= a && b <= d) {
> 					cnt--;
> 					break;
> 				}
> 			}
> 		}
>
> 		return cnt;
> 	}
> };
> ```

- Test case 사이즈가 작아서 $O(n^{2})$ 으로 풀어봤는데 생각보다 나쁘진 않다.
	- 실제 코테였으면 이렇게 풀었을듯
