---
tags:
  - mdg
  - algorithm
  - interview/retry
  - dp
date: 2026-04-07
---
> [!info] 문제 링크
> - [프로그래머스](https://school.programmers.co.kr/learn/courses/30/lessons/42895)

> [!tip] 요약
> - 다음에 한번 더 풀어봐야됨

## 최종

> [!info]- 결과
> ![[Pasted image 20260407215203.png]]

- `i` 개의 `N` 으로 만들 수 있는 모든 값의 집합으로 DP를 구성하면 된다.
	- 몰라서 클로드 물어봄; 다음에 또 풀어보자.

```cpp
#include <string>
#include <vector>
#include <set>

using namespace std;

int solution(int N, int number) {
	vector<set<int>> dp(8);

	// Using one N
	if (N == number) {
		return 1;
	}
	dp[0].insert(N);

	for (int i = 2; i <= 8; i++) { // dp[i - 1]
		int concat = N;

		for (int j = 1; j < i; j++) {
			for (auto a : dp[j - 1]) {
				for (auto b : dp[i - j - 1]) {
					// +
					if (a + b == number) {
						return i;
					} else {
						dp[i - 1].insert(a + b);
					}

					// -
					if (a - b == number) {
						return i;
					} else {
						dp[i - 1].insert(a - b);
					}

					// *
					if (a * b == number) {
						return i;
					} else {
						dp[i - 1].insert(a * b);
					}

					// /
					if (b) {
						if (a / b == number) {
							return i;
						} else {
							dp[i - 1].insert(a / b);
						}
					}
				}
			}
		}

		// Concat
		for (int j = 1; j < i; j++) {
			concat *= 10;
			concat += N;
		}
		if (concat == number) {
			return i;
		} else {
			dp[i - 1].insert(concat);
		}
	}

	return -1;
}
```

- 주의할 corner case 는 `number == N` 인 경우이다.