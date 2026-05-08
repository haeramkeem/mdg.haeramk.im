---
tags:
  - mdg
  - algorithm
  - interview
  - string
date: 2026-05-08
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/rotate-string)

> [!tip] 요약
> - Brute force 로 풀어도 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260508113207.png]]

- String size 가 작기 때문에, 그냥 brute force 로 풀어도 된다.

```cpp
class Solution {
public:
	bool rotateString(string s, string goal) {
		int len = s.size();

		if (len != goal.size()) {
			return false;
		}

		for (int i = 0; i < len; i++) {
			bool rotated = true;

			for (int j = 0; j < len; j++) {
				if (s[(i + j) % len] != goal[j]) {
					rotated = false;
					break;
				}
			}

			if (rotated) {
				return true;
			}
		}

		return false;
	}
};
```

- 다만 주의할 점은
	- `s` 와 `goal` 의 size 가 동일하다는 보장이 없으니 이 case 만 추가로 처리해주자.