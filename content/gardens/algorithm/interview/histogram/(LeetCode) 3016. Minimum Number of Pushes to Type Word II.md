---
tags:
  - mdg
  - algorithm
  - interview
  - histogram
date: 2026-07-31
aliases:
  - LeetCode 3016
  - LeetCode 3016. Minimum Number of Pushes to Type Word II
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/minimum-number-of-pushes-to-type-word-ii)

> [!tip] 요약
> - Histogram 정렬

## 최종

> [!info]- 결과
> ![[Pasted image 20260731095801.png]]

- [[(LeetCode) 3014. Minimum Number of Pushes to Type Word I|LeetCode 3014]] 의 후속 문제인데, 3014에 중복문자 조건이 추가된 형태다.
- 이건 많이 등장하는 character 는 적게 push 하도록 만들면 된다.
	1) 각 character 에 대한 histogram 을 만든다.
	2) Histogram 을 내림차순으로 정렬한다.
	3) Histogram index `i` 에 대해, `(i >> 3) + 1` 를 `histogram[i]` 곱해서 다 더한다.
		- `(i >> 3) + 1` 는 8개씩 끊어서 push 수를 1, 2, 3, ... 씩 할당해주는 것과 동일하다.
- 그래서 코드는 아래와 같다.
	- 한가지 트릭은 마지막 loop 에서 `histogram[i] = 0` 로 초기화를 해주면 `histogram` 을 재사용할 수 있다 ([[(LeetCode) 3517. Smallest Palindromic Rearrangement I|LeetCode 3517]] 과 동일).

```cpp
class Solution {
	array<int, 26> histogram{};
public:
	int minimumPushes(string word) {
		int acc = 0;

		for (char c : word) {
			histogram[c - 'a']++;
		}

		sort(histogram.begin(), histogram.end(), [](int a, int b) {
			return a > b;
		});

		for (int i = 0; i < 26; i++) {
			acc += histogram[i] * ((i >> 3) + 1);
			histogram[i] = 0;
		}

		return acc;
	}
};
```
