---
tags:
  - mdg
  - algorithm
  - interview
  - trie
date: 2026-06-20
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/number-of-valid-words-for-each-puzzle)

> [!tip] 요약
> - [[Trie (Data Structure)|Trie]] 사용하는 풀이를 생각해보자.

## 최종

> [!info]- 결과
> ![[Pasted image 20260620134727.png]]

- 솔직히 현실적인 풀이법은 [[#Bitmap 접근|아래에]] 적어두었으니, 속도가 더 빠른 [[Trie (Data Structure)|Trie]] 접근법을 알아보자.
	- 물론 다른사람들 풀이에 비해서는 좀 느리긴 하지만 그래도 이정도면 인정이지
- 요약하면, `words` 로 trie 를 build 하고 `puzzles` 의 각 원소에 대해 이 trie 를 bfs 하면 된다.
- 코드를 보자.

```cpp {48-53,56,66-68,71,72}
#define bms unsigned int

class SortedTrieNode {
	SortedTrieNode *children['z' - 'a' + 1];
	int cnt;
public:
	SortedTrieNode() {
		for (int i = 0; i < 'z' - 'a' + 1; i++) {
			children[i] = NULL;
		}

		cnt = 0;
	}

	~SortedTrieNode() {
		for (int i = 0; i < 'z' - 'a' + 1; i++) {
			if (children[i]) {
				delete children[i];
			}
		}
	}

	void insert(string &arg) {
		// Build BMS to unique-sort
		bms s = 0;

		for (char c : arg) {
			s |= 1 << (c - 'a');
		}

		// Append Trie nodes for the unique-sorted arg
		SortedTrieNode *it = this;
		for (int i = 0; i < 'z' - 'a' + 1; i++) {
			if ((s >> i) & 0x1) {
				if (!it->children[i]) {
					it->children[i] = new SortedTrieNode();
				}

				it = it->children[i];
			}
		}

		// The arg is inserted; increase the cnt
		it->cnt++;
	}

	int getTotalWordCnt(string &arg) {
		// Build BMS
		bms s = 0;

		for (char c : arg) {
			s |= 1 << (c - 'a');
		}

		// Do BFS
		queue<pair<SortedTrieNode*, bool /* Condition */>> q;
		int ret = 0;

		q.push({this, false});

		while (!q.empty()) {
			auto p = q.front();
			auto cur = p.first;
			q.pop();

			if (p.second) {
				ret += cur->cnt;
			}

			for (int i = 0; i < 'z' - 'a' + 1; i++) {
				if (cur->children[i] && ((s >> i) & 0x1)) {
					bool condition = p.second | (i == (arg[0] - 'a'));
					q.push({cur->children[i], condition});
				}
			}
		}

		return ret;
	}
};

class Solution {
public:
	vector<int> findNumOfValidWords(vector<string>& words, vector<string>& puzzles) {
		SortedTrieNode root;
		vector<int> ans;

		// Build Trie
		for (auto &w : words) {
			root.insert(w);
		}

		// Get & push word cnt
		for (auto &p : puzzles) {
			ans.push_back(root.getTotalWordCnt(p));
		}

		return ans;
	}
};
```

- 코드 설명
	- `SortedTrieNode::insert()`
		- 일반적인 trie 랑 비슷하게 하면 되는데, 다른점은:
			- 우선 `arg` 를 unique sorting 해야 한다. unique 해야 하는 이유는 `words` 의 각 원소들의 character 들이 `puzzles` 의 원소와 비교될때는 unique character 를 비교하기 때문이고, sorting 해야 하는 이유는 trie 의 node 수를 줄이기 위해서이다.
				- 위 코드에서는 unique sorting 을 할 때 [[Bitmap (Encoding)|BMS]] 를 사용했다.
			- 그리고 trie 에서는 보통 end of word 인지 체크하는 bool 을 사용하지만, 여기서는 각 word 의 개수가 필요하기 때문에 counter 가 들어간다.
	- `SortedTrieNode::getTotalWordCnt()`
		- 이 함수에 `puzzles` 의 원소를 넣으면 bfs 를 돌려서 word 의 개수를 뽑아내게 된다.
			- `L48-L53`: 우선, `arg` (인자로 들어온 `puzzles` 의 원소) 를 bms 로 만든다.
			- `L56`: 그리고 bfs 를 할때는 각 node pointer 와 condition flag 를 queue 에 넣는다.
				- 문제의 조건 상 `arg` 의 첫번째 character 가 word 에 등장해야 하기 때문에, 등장했는지의 state 를 추적하기 위한 condition flag 를 추가로 넣어주는 것.
				- 이 condition 을 바꾸는 건 `L72` 에서 처리한다.
			- `L66-L68`: Queue 에서 뺀 현재의 놈을 처리할 때는, 이놈의 condition flag 를 보고 조건을 만족하였는지 확인한 다음 만족할 때만 cnt 를 누적한다.
			- `L71`: Queue 에서 하나 빼서 다음 children 으로 넘어갈 때는, 존재하는 children 중에서 `arg` 에 존재하는 character 에 대해서만 children 에 넣는다. 이때 `L48-L53`에서 생성한 bms 를 사용한다.

## 삽질기록

### Bitmap 접근

- `words` 에 있는 모든 애들을 [[Bitmap (Encoding)|BMS]] 로 바꾸고, `puzzles` 하나하나에 대해 bms 로 바꾼 것과 비교해서 세어주면 되긴 한다.
	- 즉, `words` 의 한 원소 `w` 를 bms 로 바꾸었을 때를 `ws` 라고 하고
	- `puzzles` 의 한 원소 `p` 를 bms 로 바꾸었을 때를 `ps` 라고 했을 때
	- 우선 `ws` 에는 `p` 의 첫번째 character 가 포함되어있어야 하고
	- `ws & ps` 한 결과가 `ws` 와 같아야 한다. 다르다면 `ws` 가 `ps` 에 포함되지 않다는 뜻이므로.

> [!info]- 코드
> ```cpp
> #define bms unsigned int
>
> class Solution {
> public:
> 	vector<int> findNumOfValidWords(vector<string>& words, vector<string>& puzzles) {
> 		vector<bms> words_set;
> 		vector<int> ans;
>
> 		for (auto &w : words) {
> 			bms b = 0;
>
> 			for (char c : w) {
> 				b |= 1 << (c - 'a');
> 			}
>
> 			words_set.push_back(b);
> 		}
>
> 		for (auto &p : puzzles) {
> 			bms ps = 0;
> 			int cnt = 0;
>
> 			for (char c : p) {
> 				ps |= 1 << (c - 'a');
> 			}
>
> 			for (bms ws : words_set) {
> 				if (ws & (1 << (p[0] - 'a'))) {
> 					if ((ws & ps) == ws) {
> 						cnt++;
> 					}
> 				}
> 			}
>
> 			ans.push_back(cnt);
> 		}
>
> 		return ans;
> 	}
> };
> ```

- 근데 돌려보면 timeout 난다. 당연히 `words` 와 `puzzles` 의 원소를 비교하는 경우의 수가 $10^9$ 이기 때문.
- 그래서 최적화를 해보자: `words` vector 를 bms vector 로 바꾸지 말고, bms map 으로 바꾸는 것.
	- 즉, 같은 bms 를 갖는 값들을 하나로 묶어 map 에는 (bms -> 원소 개수) pair 을 저장하게 하는 것.
	- 이후 map 안의 모든 pair 를 순회하며 위의 방법대로 count 를 하면 된다.

> [!info]- 결과
> ![[Pasted image 20260619220750.png]]

> [!info]- 코드
> ```cpp
> #define bms unsigned int
>
> class Solution {
> public:
> 	vector<int> findNumOfValidWords(vector<string>& words, vector<string>& puzzles) {
> 		map<bms, int> alphaset;
> 		vector<int> ans;
>
> 		for (auto &w : words) {
> 			bms ws = 0;
>
> 			for (char c : w) {
> 				ws |= 1 << (c - 'a');
> 			}
>
> 			if (alphaset.find(ws) == alphaset.end()) {
> 				alphaset[ws] = 0;
> 			}
>
> 			alphaset[ws]++;
> 		}
>
> 		for (auto &p : puzzles) {
> 			bms ps = 0;
> 			int cnt = 0;
>
> 			for (char c : p) {
> 				ps |= 1 << (c - 'a');
> 			}
>
> 			for (auto &as : alphaset) {
> 				if (as.first & (1 << (p[0] - 'a'))) {
> 					if ((as.first & ps) == as.first) {
> 						cnt += as.second;
> 					}
> 				}
> 			}
>
> 			ans.push_back(cnt);
> 		}
>
> 		return ans;
> 	}
> };
> ```

- 돌려보면 통과하긴 한다. 다만 속도가 나락간다.
- 그리고 이 방법은 leetcode 에 등록된 testcase 에 대해서는 통과하지만, 통과하지 못할 경우의 수가 존재한다.
	- map 에 들어갈 수 있는 bms 의 경우의 수는 $2^{23}$ 이다. 영문 소문자의 개수가 23개이기 때문.
	- 그래서 위의 방법으로 map 의 원소 각각에 대해 `puzzles` 와 비교하면 최악의 경우 $2^{23}\times10^{4}$ 가 된다. 이건 못참쮜
