---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-07-31
aliases:
  - LeetCode 3
  - LeetCode 3. Longest Substring Without Repeating Characters
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/longest-substring-without-repeating-characters)

> [!tip] 요약
> - 1차원 DP

## 최종

> [!info]- 결과
> ![[Pasted image 20260731084231.png]]

- 우선, character 가 마지막으로 등장한 index 들을 담고 있는 array `idxs` 가 있다고 해보자.
	- 예를 들어 `s[i] == 'a'` 라면 `idxs['a'] == i` 이다.
	- 아직 등장하지 않은 character 에 대해서는 `-1` 의 값을 가진다. 따라서 처음에는 전부 `-1` 로 초기화된다.
- 그리고 `dp[i]` 를 생각해 보자.
	- `dp[i]` 는 `s[i]` 로 끝나는 substring 중에, 조건을 만족하는 가장 긴 놈의 길이이다.
	- 그럼 이놈을 계산해나가는 방법을 알아보자.
		- 우선 `idx[s[i]] == -1` 라면 아직 이 character 가 등장하지 않은것이기 때문에, 이전의 길이 +1 을 해주면 된다. 즉, `dp[i] = dp[i - 1] + 1` 이다.
		- 그렇지 않다면 이 character 가 어디서 등장했는지를 봐야 한다.
			- Index `i - 1` 로 끝나고 조건을 만족하는 substring 의 최대 길이가 `dp[i - 1]` 이므로, 이 substring 은 index `i - dp[i - 1]` 부터 `i - 1` 까지다.
			- 만약 `i - dp[i - 1] <= idx[s[i]]` 라면 `dp[i - 1]` 이 나타내는 substring 안에 `s[i]` 가 등장한다는 뜻이므로 `idxs[s[i]] + 1` 부터 `i` 까지가 최대 길이다. 그래서 `dp[i] = i - idxs[s[i]]` 가 된다.
			- 그렇지 않다면, `dp[i - 1]` 이 나타내는 substring 안에 `s[i]` 가 등장하지 않는다는 뜻이다. 그럼 `dp[i] = dp[i - 1] + 1` 이다.
- 이걸 코드로 구현하면 다음과 같다.
	- `idxs` 는 `map` 사용하니까 너무 느려서 `array` 사용했다.
	- 위에서 보면 항상 `dp[i - 1]` 만 사용된다. 그래서 vector 사용하지 말고 `prev_len` 로 바꿨다.

```cpp
class Solution {
	array<int, 128> idxs;
public:
	int lengthOfLongestSubstring(string s) {
		int n = s.size();

		if (n < 2) {
			return n;
		}

		int prev_len = 1;
		int max_len = 1;

		for (int i = 0; i < 128; i++) {
			idxs[i] = -1;
		}

		idxs[s[0]] = 0;

		for (int i = 1; i < n; i++) {
			if (i - prev_len <= idxs[s[i]]) {
				prev_len = i - idxs[s[i]];
			} else {
				prev_len = prev_len + 1;
				max_len = max(max_len, prev_len);
			}

			idxs[s[i]] = i;
		}

		return max_len;
	}
};
```
