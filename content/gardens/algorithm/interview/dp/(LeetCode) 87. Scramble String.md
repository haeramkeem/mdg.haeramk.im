---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-07-25
aliases:
  - LeetCode 87
  - LeetCode 87. Scramble String
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/scramble-string)

> [!tip] 요약
> - 3차원 DP

## 최종

> [!info]- 결과
> ![[Pasted image 20260725101759.png]]

- 3차원 DP `dp[len][i][j]` 를 사용하면 된다.
	- 여기서 `len` 은 본인을 제외한 길이라고 생각하면 된다.
		- 물론 본인 포함 길이로 해도 되는데, 그럼 `dp[0][][]` 이 쓸모없어지므로 메모리 사용량을 줄이고자 본인 제외 길이라고 했다.
	- `i` 는 `s1` 에서의 시작 index 다.
	- `j` 는 `s2` 에서의 시작 index 다.
	- 즉, `dp[len][i][j]` 는 `s1[i:i+len]` 와 `s2[j:j+len]` 가 scramble string 이냐를 나타낸다.
	- 그럼 정답은 `dp[n-1][0][0]` 이 되겠지.
- 규칙은 다음과 같다.
	- `dp[0][i][j]` 는 `s1[i] == s2[j]` 이냐로 판단하면 된다.
	- `dp[len][i][j]` 는 다음처럼 알 수 있다.
		- 우선 `len` 만큼의 string 두개로 쪼개보자. 그리고 한 놈의 길이는 `sub` 라고 해보고, 나머지는 `rem` 이라고 해보자.
			- 이때, `rem == len - sub - 1` 이다.
		- 그럼 `s1[i:i+len]` 는:
			- 길이가 `sub` 와 `rem` 가 되게 나누면:
				- $S1_1$: `s1[i:i+sub]` (길이 `sub`)
				- $S1_2$: `s1[i+sub+1:i+len]` (길이 `rem`)
			- 반대로 길이가 `rem` 과 `sub` 이 되게 나누면:
				- $S1_3$: `s1[i:i+rem]` (길이 `rem`)
				- $S1_4$: `s1[i+rem+1:i+len]` (길이 `sub`)
		- 마찬가지로 `s2[j:j+len]` 는:
			- 길이가 `sub` 와 `rem` 가 되게 나누면:
				- $S2_1$: `s2[j:j+sub]` (길이 `sub`)
				- $S2_2$: `s2[j+sub+1:j+len]` (길이 `rem`)
			- 반대로 길이가 `rem` 과 `sub` 이 되게 나누면:
				- $S2_3$: `s2[j:j+rem]` (길이 `rem`)
				- $S2_4$: `s2[j+rem+1:j+len]` (길이 `sub`)
		- 위처럼 쪼갰을 때, 경우의 수는 4가지가 있다:
			1) $S1_1$ 와 $S2_1$ 이 scramble 이고, $S1_2$ 와 $S2_2$ 이 scramble 인 경우
				- 즉, 이건 `s1[i:i+sub]` (길이 `sub`) 와 `s2[j:j+sub]` (길이 `sub`) 이 scramble 이고,
				- `s1[i+sub+1:i+len]` (길이 `rem`) 와 `s2[j+sub+1:j+len]` (길이 `rem`) 이 scramble 인 경우이다.
				- 그리고 이건 `dp[sub][i][j] && dp[rem][i+sub+1][j+sub+1]` 로 나타낼 수 있다.
			2) $S1_3$ 와 $S2_3$ 이 scramble 이고, $S1_4$ 와 $S2_4$ 이 scramble 인 경우
				- 즉, `s1[i:i+rem]` (길이 `rem`) 와 `s2[j:j+rem]` (길이 `rem`) 이 scramble 이고,
				- `s1[i+rem+1:i+len]` (길이 `sub`) 와 `s2[j+rem+1:j+len]` (길이 `sub`) 이 scramble 일 때이다.
				- 이건 `dp[rem][i][j] && dp[sub][i+rem+1][j+rem+1]` 로 나타낼 수 있다.
			3) $S1_1$ 와 $S2_4$ 이 scramble 이고, $S1_2$ 와 $S2_3$ 이 scramble 인 경우
				- 즉, `s1[i:i+sub]` (길이 `sub`) 와 `s2[j+rem+1:j+len]` (길이 `sub`) 이 scramble 이고,
				- `s1[i+sub+1:i+len]` (길이 `rem`) 와 `s2[j:j+rem]` (길이 `rem`) 이 scramble 일 때이다.
				- 이건 `dp[sub][i][j+rem+1] && dp[rem][i+sub+1][j]` 로 나타낼 수 있다.
			4) $S1_3$ 와 $S2_2$ 이 scramble 이고, $S1_4$ 와 $S2_1$ 이 scramble 인 경우
				- 즉, `s1[i:i+rem]` (길이 `rem`) 와 `s2[j+sub+1:j+len]` (길이 `rem`) 이 scramble 이고,
				- `s1[i+rem+1:i+len]` (길이 `sub`) 와 `s2[j:j+sub]` (길이 `sub`) 이 scramble 일 때이다.
				- 이건 `dp[rem][i][j+sub+1] && dp[sub][i+rem+1][j]` 로 나타낼 수 있다.
- 이걸 코드로 바꿔보면 다음과 같다:

```cpp
class Solution {
	bool dp[30][30][30] = {0};
public:
	bool isScramble(string s1, string s2) {
		int n = s1.size();

		for (int i = 0; i < n; i++) {
			for (int j = 0; j < n; j++) {
				dp[0][i][j] = (s1[i] == s2[j]);
			}
		}

		for (int len = 1; len < n; len++) {
			for (int i = 0; i + len < n; i++) {
				for (int j = 0; j + len < n; j++) {
					bool res = false;

					for (int sub = 0; sub < len; sub++) {
						int rem = len - sub - 1;

						// (sub)(rem)
						// (sub)(rem)
						res |= (dp[sub][i][j] && dp[rem][i + sub + 1][j + sub + 1]);
						// (rem)(sub)
						// (rem)(sub)
						res |= (dp[rem][i][j] && dp[sub][i + rem + 1][j + rem + 1]);
						// (sub)(rem)
						// (rem)(sub)
						res |= (dp[sub][i][j + rem + 1] && dp[rem][i + sub + 1][j]);
						// (rem)(sub)
						// (sub)(rem)
						res |= (dp[rem][i][j + sub + 1] && dp[sub][i + rem + 1][j]);
					}

					dp[len][i][j] = res;
				}
			}
		}

		return dp[n - 1][0][0];
	}
};
```
