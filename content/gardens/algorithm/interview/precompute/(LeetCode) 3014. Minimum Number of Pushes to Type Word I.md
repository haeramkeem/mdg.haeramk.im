---
tags:
  - mdg
  - algorithm
  - interview
  - precompute
date: 2026-07-30
aliases:
  - LeetCode 3014
  - LeetCode 3014. Minimum Number of Pushes to Type Word I
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/minimum-number-of-pushes-to-type-word-i)

> [!tip] 요약
> - Pre-computation

## 최종

> [!info]- 결과
> ![[Pasted image 20260730100838.png]]

- [[(LeetCode) 1291. Sequential Digits|LeetCode 1291]] 에서도 말했지만, precomputation 은 가능하다면 적용하는게 좋다.
	- 물론 여기서 '가능하다면' 은 '메모리 사용량이 많지 않다면' 의 뜻이다.
- 왜냐면 이게 바보같고 별거 아닐 것 같지만 latency-critical 한 application 에서는 이런거 하나하나가 크게 작용하기 때문.

```cpp
class Solution {
	static constexpr array<int, 26> pushes{
		1, 2, 3, 4, 5, 6, 7, 8,
		10, 12, 14, 16, 18, 20, 22, 24,
		27, 30, 33, 36, 39, 42, 45, 48,
		52, 56
	};
public:
	int minimumPushes(string word) {
		return pushes[word.size() - 1];
	}
};
```
