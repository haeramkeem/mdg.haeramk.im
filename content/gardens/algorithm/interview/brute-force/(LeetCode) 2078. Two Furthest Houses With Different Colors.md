---
tags:
  - mdg
  - algorithm
  - interview
  - brute-force
date: 2026-04-20
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/two-furthest-houses-with-different-colors)

> [!tip] 요약
> - 생각나는대로 풀면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260420111154.png]]

- Test size 가 별로 안커서, brute force 로 $O(n^{2})$ 에 풀어도 된다.

```cpp
class Solution {
public:
	int maxDistance(vector<int>& colors) {
		int max_distance = colors.size() - 1;

		for (; max_distance > 0; max_distance--) {
			for (int i = 0; i + max_distance < colors.size(); i++) {
				if (colors[i] != colors[i + max_distance]) {
					return max_distance;
				}
			}
		}
		
		// Should not happen
		return 0;
	}
};
```
