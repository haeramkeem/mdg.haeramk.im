---
tags:
  - mdg
  - algorithm
  - interview
  - sort
date: 2026-04-11
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/minimum-distance-between-three-equal-elements-ii)

> [!tip] 요약
> - 원소의 개수가 10만개 정도면 sorting할 만 하다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260411221901.png]]

- `num[i]`, `i` 순서로 정렬한 뒤 앞에서부터 순회하며 연속된 세 원소의 number가 같을 때의 index 차이를 구해주면 된다.
	- [[(LeetCode) 3740. Minimum Distance Between Three Equal Elements I|LeetCode 3740]] 의 심화 문제.

```cpp
#define MAX_U32 (0xFFFFFFFF)
#define u32 unsigned int

#define MIN(a, b) ((a) < (b) ? (a) : (b))
#define DISTANCE(a, b, c) ((b) - (a) + (c) - (b) + (c) - (a))

struct NumsElem {
	int num;
	u32 idx;
};

class Solution {
public:
	int minimumDistance(vector<int>& nums) {
		vector<NumsElem> sorted(nums.size());
		u32 ret = MAX_U32;

		for (int i = 0; i < nums.size(); i++) {
			sorted[i].num = nums[i];
			sorted[i].idx = i;
		}

		sort(sorted.begin(), sorted.end(), [](auto &a, auto &b) {
			return a.num != b.num ? a.num < b.num : a.idx < b.idx;
		});

		for (int i = 0; i + 2 < nums.size(); i++) {
			if (sorted[i].num == sorted[i + 1].num && sorted[i + 1].num == sorted[i + 2].num) {
				u32 distance = DISTANCE(sorted[i].idx, sorted[i + 1].idx, sorted[i + 2].idx);
				ret = MIN(ret, distance);
			}
		}

		return ret;
	}
};
```

- 고려한 점은:
	- 원소의 개수가 10만개 정도면 sort해도 timeout 발생 안한다. 물론 문제마다 좀 다를 순 있겠지만
	- [[Bit Packing, BP (Encoding)|BP]] 하려고 했는데, number 와 index 모두 17bit라서 그냥 구조체 썼다. 다행히 메모리 사용량이 많지는 않다.
	- return 변수 `ret` 을 `unsigned int` 로 해두고 초기값을 `0xFFFFFFFF` 로 해두면 정답이 없는 경우 자동으로 `-1` 로 반환된다. 별건 아니지만 그래도 `if` 하나 줄일 수 있는 트릭이다.