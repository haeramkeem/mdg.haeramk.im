---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-07-21
aliases:
  - LeetCode 131
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/palindrome-partitioning-ii)

> [!tip] 요약
> - 점화식찾기 + memoize

## 최종

> [!info]- 결과
> ![[Pasted image 20260721101231.png]]

- `0 <= i < n` 인 `i` 에 대해, substring `s[0:i]` 까지의 minimum cut 개수를 `dp[i]` 라고 하자. 그럼 `dp[n-1]` 가 정답이다.
- 이때 `dp[i]` 는 다음의 숫자들 중에 최소값이다.
	- 만약 `s[i]` 앞에서 cut 한다면, substring `s[0:i-1]` 의 minimum cut 은 `dp[i-1]` 이다. 그럼 이 경우에는 `dp[i-1] + 1` 이 최종 cut 수일 것이다.
	- 만약 `s[i-1:i]` 이 palindrome 이라면, `s[i-1]` 앞에서 cut 해도 될것이다. 그럼 이때의 minimum cut 은 `dp[i-2] + 1` 일 것이다.
	- 만약 `s[i-2:i]` 이 palindrome 이라면, `s[i-2]` 앞에서 cut 했을 때의 총 minimum cut 은 `dp[i-3] + 1` 일 것이다.
	- 이런식으로 `s[0:i]` 까지 다 고려해주면 `dp[i]` 를 알 수 있다.
- 이렇게 하면 정답을 찾을 수 있다. 다만 위에서 보다시피 substring 이 palindrome 인지 아닌지 반복적으로 확인해야 한다.
- 그냥 무지성으로 string 하나에 대해 character 하나하나 확인해가며 palindrome 인지 검사해도 된다. 그렇게 하면 전체 testcase 에 대해 대충 1.2초가 나오고, 하위 40% 정도의 성적으로 정답을 맞출 수 있다.
- 그럼 palindrome 검사하는 과정을 최적화해보자.
	- 위에서 보면 `dp[i]` 를 알기 위해 `s[0:i]` 부터 `s[i:i]` 까지의 substring 에 대해 palindrome 인지 아닌지를 다 검사한다는걸 알 수 있다.
	- 그럼 이 결과들을 저장해 두면, `dp[i]` 를 마무리했을 때 `i` 로 끝나는 모든 substring 에 대해 palindrome 인지 아닌지가 다 저장되는거다.
	- 이걸 활용해서 `dp[i+1]` 를 처리해보자. `0 <= l < r < i+1` 인 `l` 와 `r` 에 대해, substring `s[l:r]` 이 palindrome 인지 아닌지는 이렇게 알 수 있다:
		- 만약 `s[l] != s[r]` 라면 이놈은 무조건 palindrome 일 수가 없다.
		- 그럼 남는 경우는 `s[l] == s[r]` 이다. 이때는:
			- `l` 의 오른쪽 (즉 `l+1`) 부터 `r` 의 왼쪽 (즉 `r-1`) 이 palindrome 이 아니라면 이놈은 절대 palindrome 일 수가 없다.
			- 그래서 `s[l+1:r-1]` 이 palindrome 인지를 확인해야 되는데, `r-1 < i` 이므로 이건 이미 `dp[r-1]` 를 검사할 때 저장해 두었다.
			- 저장해둔 것을 `memoize[l+1][r-1]` 라고 해보자. 그럼 이게 `false` 라면 `s[l:r]` 도 자동으로 palindrome 이 아니게 된다.
		- 이외의 경우에는 전부 palindrome 이다. 이 결과를 `memoize[l][r]` 에 저장해 둔다.
- 여기까지 하면 전체 testcase 에 대해 40ms 정도가 나오고, 상위 10% 정도로 향상된다.
- 최종 코드는:

```cpp
class Solution {
	array<array<bool, 2000>, 2000> memoize;

	bool isPalindrome(string &s, int l, int r) {
		if (s[l] != s[r]) {
			memoize[l][r] = false;
			return false;
		}
		// s[l] == s[r]

		if ((l + 1 <= r - 1) && !(memoize[l + 1][r - 1])) {
			memoize[l][r] = false;
			return false;
		}
		// (l + 1 > r - 1) || (memoize[l + 1][r - 1])

		memoize[l][r] = true;
		return true;
	}
public:
	int minCut(string s) {
		int n = s.size();
		vector<int> dp(n, n);

		for (int r = 0; r < n; r++) {
			for (int l = 0; l <= r; l++) {
				if (isPalindrome(s, l, r)) {
					dp[r] = min(dp[r], (l == 0) ? 0 : dp[l - 1] + 1);
				}
			}
		}

		return dp[n - 1];
	}
};
```
