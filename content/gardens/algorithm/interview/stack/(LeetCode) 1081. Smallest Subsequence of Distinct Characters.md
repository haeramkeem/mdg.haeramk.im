---
tags:
  - mdg
  - algorithm
  - interview/retry
  - stack
date: 2026-07-21
aliases:
  - LeetCode 1081
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/smallest-subsequence-of-distinct-characters)

> [!tip] 요약
> - 다음에 다시 풀어보기

## 최종

> [!info]- 결과
> ![[Pasted image 20260721080205.png]]

- [[#Skip list|이거]] 말고는 생각이 안나서 정답 봤음.
- Stack 을 하나 두고 이 안에는 '항상' index 가 오름차순으로 쌓이게 하며 lexicographic 적으로도 최소가 되게 하는 풀이를 생각해 보자.
- 어차피 나중에 다시 한번 풀어볼거니까 자세한 코드 설명은 생략.

```cpp
class Solution {
public:
	string smallestSubsequence(string s) {
		int in_stack_bms = 0;
		vector<int> rem('z' - 'a' + 1, 0);

		for (char c : s) {
			rem[c - 'a']++;
		}

		string stk;
		for (char c : s) {
			if (stk.empty()) {
				stk += c;
				in_stack_bms |= (1 << (c - 'a'));
			} else {
				if (!((in_stack_bms >> (c - 'a')) & 0x1)) {
					if (stk.back() < c) {
						stk += c;
						in_stack_bms |= (1 << (c - 'a'));
					} else if (stk.back() > c) {
						char t = stk.back();

						while ((t > c) && (0 < rem[t - 'a'])) {
							stk.pop_back();
							in_stack_bms ^= (1 << (t - 'a'));

							if (stk.empty()) {
								break;
							}

							t = stk.back();
						}

						stk += c;
						in_stack_bms |= (1 << (c - 'a'));
					}
				}
			}
			rem[c - 'a']--;
		}

		return stk;
	}
};
```

## 다른 풀이

### Skip list

> [!info]- 결과
> ![[Pasted image 20260720201814.png]]

> [!info]- 코드
> ```cpp
> #define BMS unsigned int
>
> class Solution {
> public:
> 	string smallestSubsequence(string s) {
> 		int n = s.size();
> 		vector<vector<int>> skip('z' - 'a' + 1, vector<int>(n, -1));
> 		vector<BMS> shown_after(n, 0);
>
> 		skip[s[n - 1] - 'a'][n - 1] = n - 1;
> 		shown_after[n - 1] |= 1 << (s[n - 1] - 'a');
> 		for (int i = n - 2; 0 <= i; i--) {
> 			shown_after[i] = shown_after[i + 1] | (1 << (s[i] - 'a'));
>
> 			for (int j = 0; j < 'z' - 'a' + 1; j++) {
> 				skip[j][i] = skip[j][i + 1];
> 			}
>
> 			skip[s[i] - 'a'][i] = i;
> 		}
>
> 		BMS proc = 0;
> 		int cur = 0;
> 		string ret = "";
> 		while (proc != shown_after[0]) {
> 			for (int i = 0; i < 'z' - 'a' + 1; i++) {
> 				if ((skip[i][cur] != -1) && !((proc >> i) & 0x1)) {
> 					if ((proc | shown_after[skip[i][cur]]) == shown_after[0]) {
> 						proc |= (1 << i);
> 						cur = skip[i][cur];
> 						ret += ('a' + i);
> 						break;
> 					}
> 				}
> 			}
> 		}
>
> 		return ret;
> 	}
> };
> ```

- 다음으로 결과에 추가할 character 를 선택할 때
	- 우선 alphabet 순서로 가장 작고
	- 아직 추가되지 않은 character 이며
	- 지금까지 추가한 character set 과 해당 character 이후에 등장할 character set 의 합집합이 전체 집합이냐
- 를 고려해서 선택해 나가는 방법이다.
- 이를 위해서
	- 다음에 등장할 alphabet 이 어느 index 에 있는지 skip list 마냥 바로 찾아갈 수 있게 하고
	- 한 character 에 대해 이후에 등장하는 character set 들을 저장해놓는 방식
- 설명이 좀 장황한데, 어차피 속도도 느리고 메모리도 많이 차지해서 별로 좋은 풀이는 아니어서 쉽게 풀어서 설명하지 않고 이정도까지만.