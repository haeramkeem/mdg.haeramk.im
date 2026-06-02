---
tags:
  - mdg
  - algorithm
  - interview
  - trie
date: 2026-05-28
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/best-time-to-buy-and-sell-stock)

> [!tip] 요약
> - [[Trie (Data Structure)|Trie]] 쓰면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260528180738.png]]

- 문제는 읽어보면 간단하다. 그냥 [[Trie (Data Structure)|Trie]] 쓰되 suffix 를 비교해야하므로 뒤에서부터 넣으면 된다.
	- 근데 구현이 손에 익숙하지 않으면 시간을 좀 쓰게 되어있음

```cpp
#define MAX_I32 (0x7FFFFFFF)

class TrieNode {
	int min_len_word_id = -1;
	int min_len = MAX_I32;
	TrieNode *next['z' - 'a' + 1] = {0};
public:
	void add(string &word, int rev_idx, int word_id) {
		if (word.size() < min_len) {
			min_len = word.size();
			min_len_word_id = word_id;
		}

		if (rev_idx < 0) {
			return;
		}

		int child_idx = word[rev_idx] - 'a';
		if (!next[child_idx]) {
			next[child_idx] = new TrieNode();
		}

		next[child_idx]->add(word, rev_idx - 1, word_id);
	}

	int &get_min_len_word_id(string &query, int rev_idx) {
		if (rev_idx < 0) {
			return min_len_word_id;
		}

		int child_idx = query[rev_idx] - 'a';
		if (!next[child_idx]) {
			return min_len_word_id;
		}

		return next[child_idx]->get_min_len_word_id(query, rev_idx - 1);
	}

	~TrieNode() {
		for (int i = 0; i < 'z' - 'a' + 1; i++) {
			if (next[i]) {
				delete next[i];
			}
		}
	}
};

class Solution {
public:
	vector<int> stringIndices(vector<string>& wordsContainer, vector<string>& wordsQuery) {
		TrieNode root;
		vector<int> ret;

		for (int i = 0; i < wordsContainer.size(); i++) {
			auto &word = wordsContainer[i];

			root.add(word, word.size() - 1, i);
		}

		for (auto &word : wordsQuery) {
			ret.push_back(root.get_min_len_word_id(word, word.size() - 1));
		}

		return ret;
	}
};
```

- 결과가 좀 느리긴 한데, 그래도 구현한거에 의미를 두자.