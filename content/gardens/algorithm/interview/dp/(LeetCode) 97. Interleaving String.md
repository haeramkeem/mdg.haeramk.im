---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-07-17
aliases:
  - LeetCode 97
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/interleaving-string)

> [!tip] 요약
> - 점화식 찾는 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260717182637.png]]

- `dp[i1][i2]` 를 이렇게 정의해보자:
	- 의미:
		- `dp[i1][i2]` 는 `s1[0:i1 - 1]` 와 `s2[0:i2 - 1]` 을 interleave 하여 `s3[0:i1 + i2 - 1]` 를 만들 수 있냐를 나타낸다.
	- 초기화:
		- Index 0 은 아무것도 사용하지 않음 (`""`) 을 나타낸다. 따라서 `dp[0][0]` 은 `""` 와 `""` 으로 `""` 을 만드는 것이므로 항상 참이다.
		- `dp[i1][0]` 은 `s1[0:i1 - 1]` 이 `s3[0:i1 - 1]` 와 같냐를 나타낸다.
		- `dp[0][i2]` 은 `s2[0:i2 - 1]` 이 `s3[0:i2 - 1]` 와 같냐를 나타낸다.
	- 점화식: 다음의 A 와 B 중 하나만 참이어도 참이다.
		- 조건 A: 다음의 A-1 와 A-2 가 모두 참이어야 참이다.
			- 조건 A-1: `dp[i1 - 1][i2]` 가 참이면, `s1[0:i1 - 2]` 와 `s2[0:i2 - 1]` 을 interleave 하여 `s3[0:i1 + i2 - 2]` 를 만들 수 있다는 것이다.
			- 조건 A-2: 이때, 만약 `s1[i1 - 1]` 와 `s3[i1 + i2 - 1]` 이 같다면 `dp[i1 - 1][i2]` 가 참인 경우에 `s1[i1 - 1]` 를 붙여 `s3[i1 + i2 - 1]` 를 만들 수 있으므로 `dp[i1][i2]` 도 참이다.
		- 조건 B: 다음의 B-1 와 B-2 와 모두 참이어야 참이다.
			- 조건 B-1: `dp[i1][i2 - 1]` 가 참이면, `s1[0:i1 - 1]` 와 `s2[0:i2 - 2]` 을 interleave 하여 `s3[0:i1 + i2 - 2]` 를 만들 수 있다는 것이다.
			- 조건 B-2: 이때, 만약 `s2[i2 - 1]` 와 `s3[i1 + i2 - 1]` 이 같다면 `dp[i1][i2 - 1]` 가 참인 경우에 `s2[i2 - 1]` 를 붙여 `s3[i1 + i2 - 1]` 를 만들 수 있으므로 `dp[i1][i2]` 도 참이다.
- 이렇게 풀면 [[#Full-DP|아래의 풀이]] 가 된다.
- 여기에 문제의 challenge 에 나온 대로 공간복잡도를 `O(s2.length)` 만 사용하려면, `dp[2][s2.length]` 로 만들어주면 된다.
	- 위의 점화식을 보면 `dp[i1][i2]` 는 `dp[i1 - 1][i2]` 에 의존한다는 것을 알 수 있다.
	- 그래서 `dp` 의 row 를 2개만 두고 double buffering 마냥 돌아가면서 사용하면 동일한 로직을 더 적은 메모리로 풀 수 있다.

```cpp
class Solution {
public:
	bool isInterleave(string s1, string s2, string s3) {
		if (s1.empty() || s2.empty()) {
			return s1 == s3 || s2 == s3;
		}

		int n1 = s1.size();
		int n2 = s2.size();
		int n3 = s3.size();

		if (n1 + n2 != n3) {
			return false;
		}

		vector<vector<bool>> dp(2, vector<bool>(n2 + 1));

		dp[0][0] = true;
		for (int i2 = 1; i2 <= n2; i2++) {
			dp[0][i2] = dp[0][i2 - 1] && (s2[i2 - 1] == s3[i2 - 1]);
		}

		for (int i1 = 1; i1 <= n1; i1++) {
			int cur = i1 & 0x1;
			int prv = (i1 - 1) & 0x1;

			dp[cur][0] = dp[prv][0] && (s1[i1 - 1] == s3[i1 - 1]);

			for (int i2 = 1; i2 <= n2; i2++) {
				int i3 = i1 + i2 - 1;
				bool take_s1 = dp[prv][i2] && (s1[i1 - 1] == s3[i3]);
				bool take_s2 = dp[cur][i2 - 1] && (s2[i2 - 1] == s3[i3]);
				dp[cur][i2] = take_s1 || take_s2;
			}
		}

		return dp[n1 & 0x1][n2];
	}
};
```

## 다른 풀이

### Full-DP

> [!info]- 결과
> ![[Pasted image 20260717181556.png]]

> [!info]- 코드
> ```cpp
> class Solution {
> public:
> 	bool isInterleave(string s1, string s2, string s3) {
> 		if (s1.empty() || s2.empty()) {
> 			return s1 == s3 || s2 == s3;
> 		}
>
> 		int n1 = s1.size();
> 		int n2 = s2.size();
> 		int n3 = s3.size();
>
> 		if (n1 + n2 != n3) {
> 			return false;
> 		}
>
> 		vector<vector<bool>> dp(n1 + 1, vector<bool>(n2 + 1));
>
> 		dp[0][0] = true;
> 		for (int i2 = 1; i2 <= n2; i2++) {
> 			dp[0][i2] = dp[0][i2 - 1] && (s2[i2 - 1] == s3[i2 - 1]);
> 		}
>
> 		for (int i1 = 1; i1 <= n1; i1++) {
> 			dp[i1][0] = dp[i1 - 1][0] && (s1[i1 - 1] == s3[i1 - 1]);
>
> 			for (int i2 = 1; i2 <= n2; i2++) {
> 				int i3 = i1 + i2 - 1;
> 				bool take_s1 = dp[i1 - 1][i2] && (s1[i1 - 1] == s3[i3]);
> 				bool take_s2 = dp[i1][i2 - 1] && (s2[i2 - 1] == s3[i3]);
> 				dp[i1][i2] = take_s1 || take_s2;
> 			}
> 		}
>
> 		return dp[n1][n2];
> 	}
> };
> ```

- [[#최종|위]] 에서 double buffering 하지 않고 그냥 쭉 전개시킨 것이다.
