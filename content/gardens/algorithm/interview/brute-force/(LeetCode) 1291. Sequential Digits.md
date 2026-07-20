---
tags:
  - mdg
  - algorithm
  - interview
  - brute-force
date: 2026-07-13
aliases:
  - LeetCode 1291
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/sequential-digits)

> [!tip] 요약
> - Pre-computation

## 최종

> [!info]- 결과
> ![[Pasted image 20260713103654.png]]

- 아마 이 문제의 풀이중에 가장 멍청한 풀이일거다. 하지만 [[index|주인장]] 은 이 풀이가 최고라고 생각한다.
	- 코테문제이므로 푸는 속도도 중요하다. 이렇게 풀면 고민할 필요 없이 5분이면 된다.
	- 이런 pre-computation 은 멍청해보이지만 생각보다 자주 사용된다.
		- 우선 array 에 있으므로 [[Locality (Replacement)|Locality]] 가 좋아진다.
		- 연산이 필요 없기 때문에 [[Central Processing Unit, CPU (Arch)|CPU]] cycle 도 절약된다.
		- 당연히 memory footprint 의 trade-off 가 있지만 이 문제같이 array 의 크기가 작은 경우에는 충분히 고려할 만한 접근이다.

```cpp
constexpr array<int, 36> candidate = {
	12, 23, 34, 45, 56, 67, 78, 89,
	123, 234, 345, 456, 567, 678, 789,
	1234, 2345, 3456, 4567, 5678, 6789,
	12345, 23456, 34567, 45678, 56789,
	123456, 234567, 345678, 456789,
	1234567, 2345678, 3456789,
	12345678, 23456789,
	123456789
};

class Solution {
public:
	vector<int> sequentialDigits(int low, int high) {
		auto l = lower_bound(candidate.begin(), candidate.end(), low);
		auto h = upper_bound(candidate.begin(), candidate.end(), high);
		vector<int> ret;

		for (; l != h; l++) {
			ret.push_back(*l);
		}

		return ret;
	}
};
```
