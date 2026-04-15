---
tags:
  - mdg
  - algorithm
  - interview
  - string
date: 2026-04-15
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/shortest-distance-to-target-string-in-a-circular-array)

> [!tip] 요약
> - 하라는대로 하면 풀리는 문제.

## 최종

> [!info]- 결과
> ![[Pasted image 20260415124729.png]]

- 어려운 문제는 아니다. 하라는대로 하면 풀린다.

```cpp
#define ABS_DIFF(a, b) ((a) > (b) ? (a) - (b) : (b) - (a))
#define MIN(a, b) ((a) < (b) ? (a) : (b))
#define MIN4(a, b, c, d) (MIN(MIN((a), (b)), MIN((c), (d))))

#define u32 unsigned int
#define MAX_U32 (0xFFFFFFFF)

class Solution {
public:
	int closestTarget(vector<string>& words, string target, int startIndex) {
		u32 min = MAX_U32;

		for (int i = 0; i < words.size(); i++) {
			if (words[i] == target) {
				min = MIN4(min, words.size() - startIndex + i, words.size() - i + startIndex, ABS_DIFF(i, startIndex));
			}
		}

		return min;
	}
};
```

- Corner case 는 `target` string 이 여러개 있을 때이다. 처음 만난 `target` 에 대해 바로 `return` 해버리면 안된다.