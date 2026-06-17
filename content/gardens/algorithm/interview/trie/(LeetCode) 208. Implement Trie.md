---
tags:
  - mdg
  - algorithm
  - interview
  - trie
date: 2026-06-17
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/implement-trie-prefix-tree)

> [!tip] 요약
> - 구현문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260617205641.png]]

- [[Trie (Data Structure)|Trie]] 구현문제다.

```cpp
class Trie {
private:
	Trie* children['z' - 'a' + 1];
	bool is_last;
public:
	Trie() {
		for (int i = 0; i < 'z' - 'a' + 1; i++) {
			children[i] = NULL;
		}

		is_last = false;
	}

	~Trie() {
		for (int i = 0; i < 'z' - 'a' + 1; i++) {
			if(children[i]) {
				delete children[i];
			}
		}
	}

	void insert(string word) {
		Trie* it = this;

		for (char ch : word) {
			if(!it->children[ch - 'a']) {
				it->children[ch - 'a'] = new Trie();
			}
			it = it->children[ch - 'a'];
		}
		it->is_last = true;
	}
	
	bool search(string word) {
		Trie* it = this;

		for (char ch : word) {
			if (!it->children[ch - 'a']) {
				return false;
			}
			it = it->children[ch - 'a'];
		}
		return it->is_last;
	}
	
	bool startsWith(string prefix) {
		Trie* it = this;

		for (char ch : prefix) {
			if (!it->children[ch - 'a']) {
				return false;
			}
			it = it->children[ch - 'a'];
		}
		return true;
	}
};
```
