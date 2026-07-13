---
tags:
  - mdg
  - algorithm
  - interview/retry
  - dp
date: 2026-07-09
aliases:
  - LeetCode 3756
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/concatenate-non-zero-digits-and-multiply-by-sum-ii)

> [!tip] 요약
> - 에라이

## 최종

> [!info]- 결과
> ![[Pasted image 20260709083133.png]]

- 이 문제의 가장 큰 난관은 modulo 이다. 이거때문에 정답보고 풀었다.
	- 솔직히 이 문제에서 prefix sum 은 최적화의 영역이고, 이걸 적용하지 않으면 속도는 느려지지만 정확성의 문제는 없다.
	- 근데 저 modulo 는 정확성의 문제다. 근데 모든 풀이가 왜 이렇게 modulo 를 해도 괜찮은지 설명되어있지 않다.
- Prefix sum 을 하는 방법은 간단하다:
	- `prefix` array 는 `prefix[i]` 이 `substring[0:i]` 에서 0을 제외하고 concat 한 int 이다.
	- 그리고 `sum` array 는 `sum[i]` 이 `substring[0:i]` 에서 0을 제외한 모든 digit 들의 합이다.
	- 마지막으로 `len` array 는 `len[i]` 이 `substring[0:i]` 에서 0이 아닌 digit 의 개수 (즉, `prefix[i]` 의 길이) 이다.
	- 그래서 정답은 `prefix[r] - prefix[l - 1] * 10^(len[r] - len[l - 1])` 에다가 `sum[r] - sum[l - 1]` 을 곱해주면 된다.
	- 이해가 안된다면 종이에 적어가면서 생각해보자. 이걸 깊게 설명하고싶지는 않다.
- 그래 뭐 좋다 이거야. 근데 이 풀이에서 overflow 가 안나도록 `10^9 + 7` 로 modulo 를 해줘야 하는데, 어떻게 하는지는 그냥 코드만 던져놓고 왜 그래야 하는지는 안알려준다.
	- 가령 아래 코드에서 `L48` 에 `MOD` 를 더해준다. 왜??
	- 뭐 좀 고민하다보면 왜그런지 알 수 있기야 하겠다만, 일단 킹받아서 나중에 생각해보련다.

```cpp {48}
#define MOD 1000000007
#define MAXLEN 100000

#define ull unsigned long long
#define ULL(a) ((ull)(a))

class Solution {
	int power_of_ten[MAXLEN + 1];
public:
	Solution() {
		power_of_ten[0] = 1;

		for (int i = 1; i <= MAXLEN; i++) {
			power_of_ten[i] = (ULL(power_of_ten[i - 1]) * 10) % MOD;
		}
	}

	vector<int> sumAndMultiply(string s, vector<vector<int>>& queries) {
		int m = s.size();
		vector<int> prefix(m);
		vector<int> sum(m);
		vector<int> len(m);
		vector<int> ret;

		prefix[0] = sum[0] = s[0] - '0';
		len[0] = (s[0] != '0') ? 1 : 0;

		for (int i = 1; i < m; i++) {
			int digit = s[i] - '0';

			sum[i] = sum[i - 1] + digit;

			if (digit) {
				prefix[i] = (ULL(prefix[i - 1]) * 10 + digit) % MOD;
				len[i] = len[i - 1] + 1;
			} else {
				prefix[i] = prefix[i - 1];
				len[i] = len[i - 1];
			}
		}

		for (auto &q : queries) {
			if (q[0] == 0) {
				ret.push_back(ULL(prefix[q[1]]) * ULL(sum[q[1]]) % MOD);
			} else /* (q[0] > 0) */ {
				ull res = prefix[q[1]];
				res -= (ULL(prefix[q[0] - 1]) * ULL(power_of_ten[len[q[1]] - len[q[0] - 1]])) % MOD;
				res += MOD; // ??
				res *= (sum[q[1]] - sum[q[0] - 1]);

				ret.push_back(res % MOD);
			}
		}

		return ret;
	}
};
```
