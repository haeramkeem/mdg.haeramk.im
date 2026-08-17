---
tags:
  - mdg
  - algorithm
  - interview/retry
  - subarray-subsequence
date: 2026-08-15
aliases:
  - LeetCode 3302
  - LeetCode 3302. Find the Lexicographically Smallest Valid Sequence
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/find-the-lexicographically-smallest-valid-sequence)

> [!tip] 요약
> - 다음에 다시 풀어보기

## 최종

> [!info]- 결과
> ![[Pasted image 20260815173410.png]]

- 어차피 나중에 다시 풀어봐야되니까 key idea 만 간단하게 적어보면:
	- `word1` 와 `word2` 에 pointer 를 하나씩 두고 character 를 앞에서부터 매칭할거다.
	- 두 pointer 가 가리키는 놈이 같으면 그냥 매칭시키고 두 포인터를 옆으로 움직이면 된다.
	- 근데 다르면 문제가 된다: 하나 있는 free change 기회를 소진해서 매칭시킬까 말까를 정해야 된다.
		- 만약 지금 소진했는데, 뒤에서 또 필요한 경우가 생기면 안되니까 언제 쓸지를 고민해야 하는데 이걸 알아내는 방법은 suffix match 를 활용하는거다.
			- `suffix_match[i]` 는 `word1[i+1:]` 의 substring 에 대해 `word2` 와 매칭되는 character 가 얼마나 있냐를 저장한다.
		- 즉, 지금까지 매칭한 수 + 1 (지금 free change 사용해서 매칭) + `suffix_match[i]` (이후로 매칭될 개수) 를 확인하면 지금 free change 를 사용했을 때 뒤에서는 free change 없이 전부 매칭할 수 있는지를 알 수 있게 된다.

```cpp
class Solution {
public:
	vector<int> validSequence(string word1, string word2) {
		int n1 = word1.size();
		int n2 = word2.size();
		vector<int> suffix_match(n1);
		vector<int> ret(n2);

		{
			int i2 = n2 - 1;
			int matched = 0;
			for (int i1 = n1 - 1; 0 <= i1; i1--) {
				suffix_match[i1] = matched;

				if (0 <= i2 && word1[i1] == word2[i2]) {
					i2--;
					matched++;
				}
			}
		}

		{
			int i2 = 0;
			int matched = 0;
			bool changed = false;
			for (int i1 = 0; i1 < n1 && i2 < n2; i1++) {
				if (word1[i1] != word2[i2]) {
					if (!changed && (matched + suffix_match[i1] + 1 >= n2)) {
						ret[i2] = i1;
						i2++;
						matched++;
						changed = true;
					}
				} else {
					ret[i2] = i1;
					i2++;
					matched++;
				}
			}

			if (matched != n2) {
				return {};
			}
		}

		return ret;
	}
};
```

## 삽질 기록

### DP

> [!info]- 코드
> ```cpp
> #define MAX_INT (0x7FFFFFFF)
>
> class Solution {
> public:
> 	vector<int> validSequence(string word1, string word2) {
> 		int n1 = word1.size();
> 		int n2 = word2.size();
> 		vector<vector<int>> dp(n2 + 1, vector<int>(n1 + 1, MAX_INT));
> 		vector<int> ret(n2);
>
> 		for (int i1 = 0; i1 <= n1; i1++) {
> 			dp[n2][i1] = 0;
> 		}
>
> 		for (int i2 = n2 - 1; 0 <= i2; i2--) {
> 			for (int i1 = (n1 + 1) - (n2 - i2) - 1; 0 <= i1; i1--) {
> 				int cost = (word2[i2] == word1[i1]) ? 0 : 1;
> 				dp[i2][i1] = min(dp[i2][i1 + 1], dp[i2 + 1][i1 + 1] + cost);
> 			}
> 		}
>
> 		if (dp[0][0] > 1) {
> 			return {};
> 		}
>
> 		int i2 = 0;
> 		int i1 = 0;
> 		int rem = 1;
>
> 		while (i2 < n2 && i1 <= n1 - n2 + i2) {
> 			int cost = (word2[i2] == word1[i1]) ? 0 : 1;
>
> 			if (dp[i2 + 1][i1 + 1] + cost <= rem) {
> 				rem -= cost;
> 				ret[i2] = i1;
> 				i1++;
> 				i2++;
> 			} else {
> 				i1++;
> 			}
> 		}
>
> 		return ret;
> 	}
> };
> ```

- 2D DP 로 해봤는데 $300000 \times 300000$ 이어서 터진다.