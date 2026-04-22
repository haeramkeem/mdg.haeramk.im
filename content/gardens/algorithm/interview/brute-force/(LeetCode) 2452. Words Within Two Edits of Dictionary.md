---
tags:
  - mdg
  - algorithm
  - interview
  - brute-force
date: 2026-04-22
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/words-within-two-edits-of-dictionary)

> [!tip] 요약
> - Test case 크기만 괜찮다면, brute-force 로 먼저 시도하기

## 최종

> [!info]- 결과
> ![[Pasted image 20260422095030.png]]

- 실제로 코테 문제로 출제된다면, 시도해야 할 첫번째 방법은 brute-force 이다.
	- 왜냐면 test case 의 크기가 그렇게 크지 않기 때문에, $O(n^{2})$ 로 돌려도 괜찮을 것 같다는 생각이 들기 때문.
	- 해보면 느리긴 하지만 통과는 된다. 이 풀이로 하면 10분 내외로 풀 수 있기 때문에 이 문제에서 시간을 확보해서 다른 문제에 투자하는 것도 현명하다.

```cpp
class Solution {
	bool check(string &a, string &b) {
		int cnt = 0;

		for (int i = 0; i < a.size(); i++) {
			if (a[i] != b[i]) {
				cnt++;
			}

			if (cnt > 2) {
				return false;
			}
		}

		return true;
	}
public:
	vector<string> twoEditWords(vector<string>& queries, vector<string>& dictionary) {
		vector<string> ret;

		for (auto &q : queries) {
			for (auto &d : dictionary) {
				if (check(q, d)) {
					ret.push_back(q);
					break;
				}
			}
		}

		return ret;
	}
};
```

- 다른 풀이 보니까 `inner_product` 혹은 [[Trie (Data Structure)|Trie]] 를 사용하는 것 같던데, `inner_product` 는 사용법이 생각 안날 수도 있고 Trie 는 구현에 시간이 걸리니까 이렇게 풀어도 무방할 것 같다.