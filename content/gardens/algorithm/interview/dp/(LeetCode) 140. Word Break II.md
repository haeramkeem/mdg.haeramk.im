---
tags:
  - mdg
  - algorithm
  - interview
  - dp
date: 2026-07-29
aliases:
  - LeetCode 140
  - LeetCode 140. Word Break II
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/word-break-ii)

> [!tip] 요약
> - [[(LeetCode) 139. Word Break|LeetCode 139]] 변형문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260729115355.png]]

- [[(LeetCode) 139. Word Break|LeetCode 139]] 가 그냥 breakable 인지만 보는거였다면, 이 문제는 실제로 break 된 결과를 전부 출력하라는거다.
- 그래서 사실상 같은 문젠데, T/F 가 아닌 string 을 만들어주도록 코드를 바꿔주면 된다.

```cpp
class Str {
	vector<int> idxs;
public:
	Str(int idx) {
		idxs.push_back(idx);
	}

	Str(Str &other, int idx) {
		for (int i : other.idxs) {
			idxs.push_back(i);
		}
		idxs.push_back(idx);
	}

	string to_string(vector<string>& dict) {
		string ret = "";

		for (int i = 0; i < idxs.size() - 1; i++) {
			ret += dict[idxs[i]] + " ";
		}
		ret += dict[idxs.back()];

		return ret;
	}
};

class Solution {
public:
	vector<string> wordBreak(string s, vector<string>& wordDict) {
		int n = s.size();
		vector<vector<int>> dp_idx(n + 1, vector<int>(n + 1, -1));
		vector<vector<Str>> dp_str(n + 1);
		vector<string> ret;

		for (int i = 0; i < wordDict.size(); i++) {
			auto &w = wordDict[i];
			int idx = s.find(w, 0);

			while (idx != -1) {
				int end = idx + w.size();
				dp_idx[idx][end] = i;
				idx = s.find(w, idx + 1);
			}
		}

		for (int i = 1; i <= n; i++) {
			if (dp_idx[0][i] != -1) {
				dp_str[i].push_back(Str(dp_idx[0][i]));
			}
		}

		for (int i = 1; i <= n; i++) {
			for (int j = 0; j < i; j++) {
				if (dp_idx[j][i] != -1) {
					for (auto &str : dp_str[j]) {
						dp_str[i].push_back(Str(str, dp_idx[j][i]));
					}
				}
			}
		}

		for (auto &str : dp_str[n]) {
			ret.push_back(str.to_string(wordDict));
		}

		return ret;
	}
};
```

- 간단한 최적화는:
	- [[(LeetCode) 139. Word Break|LeetCode 139]] 에서는 2차원 boolean DP 를 사용했지만 여기서는 index 를 저장하도록 2차원 int DP `vector<vector<int>> dp_idx` 를 사용했다.
	- 그리고 `s[0:i-1]` 에 대한 broken string 은 string 대신 dict index 들만 담는 `Str` 로 추상화했고, 이들을 담기 위한 DP 인 `vector<vector<Str>> dp_str` 를 사용했다.
		- 이때 `dp_str[i]` 는 `s[0:i-1]` 에 대한 broken string 들의 모음이다.