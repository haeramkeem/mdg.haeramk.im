---
tags:
  - mdg
  - algorithm
  - interview
  - trie
date: 2026-06-19
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/stream-of-characters)

> [!tip] 요약
> - [[Trie (Data Structure)|Trie]] 쓰면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260619210739.png]]

- 좀 더 최적화된 풀이가 있을거같긴 한데, 그래도 [[Trie (Data Structure)|Trie]] 쓰면 풀리긴 한다.
	- `words` 이용해 전부 trie 에 넣어두고
	- `query()` 처리할때는 `letter` 를 누적하고 누적된 string 을 trie 에 넣어서 suffix 가 있는지 확인하면 된다.

```cpp
class ReverseTrieNode {
	ReverseTrieNode *children['z' - 'a' + 1];
	bool is_end;
public:
	ReverseTrieNode() {
		for (int i = 0; i < 'z' - 'a' + 1; i++) {
			children[i] = NULL;
		}

		is_end = false;
	}

	~ReverseTrieNode() {
		for (int i = 0; i < 'z' - 'a' + 1; i++) {
			if (children[i]) {
				delete children[i];
			}
		}
	}

	void insert(string &arg) {
		ReverseTrieNode *it = this;

		for (int i = 0; i < arg.size(); i++) {
			int children_idx = arg[arg.size() - i - 1] - 'a';

			if (!it->children[children_idx]) {
				it->children[children_idx] = new ReverseTrieNode();
			}

			it = it->children[children_idx];
		}

		it->is_end = true;
	}

	bool suffixAvailable(string &arg) {
		ReverseTrieNode *it = this;

		for (int i = 0; i < arg.size(); i++) {
			if (it->is_end) {
				return true;
			}

			int children_idx = arg[arg.size() - i - 1] - 'a';

			if (!it->children[children_idx]) {
				return false;
			}

			it = it->children[children_idx];
		}

		return it->is_end;
	}
};

class StreamChecker {
	ReverseTrieNode rtrie;
	string acc = "";
public:
	StreamChecker(vector<string>& words) {
		for (auto &w : words) {
			rtrie.insert(w);
		}
	}
	
	bool query(char letter) {
		acc += letter;

		return rtrie.suffixAvailable(acc);
	}
};

/**
 * Your StreamChecker object will be instantiated and called as such:
 * StreamChecker* obj = new StreamChecker(words);
 * bool param_1 = obj->query(letter);
 */
```
