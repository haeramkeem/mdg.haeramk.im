---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-07-17
aliases:
  - LeetCode 131
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/palindrome-partitioning)

> [!tip] 요약
> - 중복제거 방법 고민하기

## 최종

> [!info]- 결과
> ![[Pasted image 20260718110955.png]]

- 이렇게 생각해보자.
	1) `a`, `b` 가 palindrome 이고 `a == b` 라면 `a + b` 도 palindrome 이다.
	2) `a`, `b`, `c` 가 palindrome 이고 `a == c` 라면 `a + b + c` 도 palindrome 이다.
	3) `a`, `b`, `c`, `d` 가 palindrome 이고 `a == d`, `b == c` 라면 `a + b + c + d` 도 palindrome 이다.
- 뭐 이런식으로 합쳐주면 된다.
- 근데 이렇게 하면 중복이 발생한다.
	- 위의 예시에서 (3) 을 보면 `b` 와 `c` 를 (1) 로 합치고, `a`, `b + c`, `d` 를 (2) 로 합치면 (3) 과 같아진다.
- 이런 중복을 막을 방법은 '어디서부터 합치기 시작할지' 를 기억하는 것이다.
	- 가령 `b` 와 `c` 를 (1) 로 합쳤다고 해보자. 그럼 다음 합치는 작업을 `b + c` 뒤에서 하도록 하면 `a`, `b + c`, `d` 를 합쳐서 (3) 과 동일한 결과가 나오는 일이 발생하지 않는다.
- 이렇게 하면 풀리긴 한다. 결과 보면 좀 구리긴 한데, 뭐 string copy overhead 때문일거 같다. 어떻게 빠르게할지는 잘 모르겠음.

```cpp
class Solution {
public:
	vector<vector<string>> partition(string s) {
		vector<vector<string>> ret;
		vector<int> from;

		// Initial
		ret.push_back({});
		from.push_back(0);
		for (char c : s) {
			ret[0].push_back(string(1, c));
		}

		for (int v = 0; v < ret.size(); v++) {
			for (int len = 2; len <= ret[v].size(); len++) {
				for (int l = from[v]; l + len - 1 < ret[v].size(); l++) {
					bool palindrome = true;

					// Check if concat will generate palindrome
					for (int o = 0; o < (len >> 1); o++) {
						if (ret[v][l + o] != ret[v][l + len - o - 1]) {
							palindrome = false;
							break;
						}
					}

					// Concat substring
					if (palindrome) {
						ret.push_back({});
						from.push_back(l);

						for (int i = 0; i < l; i++) {
							ret.back().push_back(ret[v][i]);
						}

						// Do concat
						ret.back().push_back("");
						for (int i = l; i < l + len; i++) {
							ret.back().back() += ret[v][i];
						}

						for (int i = l + len; i < ret[v].size(); i++) {
							ret.back().push_back(ret[v][i]);
						}
					}
				}
			}
		}

		return ret;
	}
};
```
