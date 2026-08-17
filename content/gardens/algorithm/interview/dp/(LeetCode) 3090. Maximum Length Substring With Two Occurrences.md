---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-08-14
aliases:
  - LeetCode 3090
  - LeetCode 3090. Maximum Length Substring With Two Occurrences
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/maximum-length-substring-with-two-occurrences)

> [!tip] 요약
> - 1D DP

## 최종

> [!info]- 결과
> ![[Pasted image 20260814225715.png]]

- 인덱스 `i` 에 대한 suffix substring 의 조건을 만족하는 최대 길이가 얼마인지, 그리고 그것이 인덱스 `i+1` 에 어떻게 영향을 주는지를 가지고 1D DP 를 하면 된다.

```cpp
class Solution {
	array<array<int, 2>, 26> indices;

	void init_indices() {
		for (int i = 0; i < 26; i++) {
			for (int j = 0; j < 2; j++) {
				indices[i][j] = -1;
			}
		}
	}
public:
	int maximumLengthSubstring(string s) {
		int n = s.size();
		int max_len = 1;
		int begin = 0;

		init_indices();

		for (int i = 0; i < n; i++) {
			int idx = s[i] - 'a';

			if (indices[idx][0] == -1) {
				indices[idx][0] = i;
			} else if (indices[idx][1] == -1) {
				indices[idx][1] = i;
			} else {
				if (begin <= indices[idx][0]) {
					begin = indices[idx][0] + 1;
				}

				indices[idx][0] = indices[idx][1];
				indices[idx][1] = i;
			}

			max_len = max(max_len, i - begin + 1);
		}

		return max_len;
	}
};
```
