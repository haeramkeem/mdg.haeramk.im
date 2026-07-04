---
tags:
  - mdg
  - algorithm
  - interview
  - two-pointer
date: 2026-07-04
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/valid-palindrome)

> [!tip] 요약
> - Two pointer 로 양쪽에서 좁혀오면서 풀면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260704123225.png]]

- Two pointer 로 양쪽에서 좁혀오면서 풀면 된다.
	- 다만 alphanumeric 이어서 조건처리하기 귀찮다.

```cpp
#define ABS_DIFF(a, b) ((a) > (b) ? (a) - (b) : (b) - (a))

class Solution {
	int getNext(string &s, int idx, bool l2r) {
		while (0 <= idx && idx < s.size()) {
			bool is_lowercase = ('a' <= s[idx] && s[idx] <= 'z');
			bool is_uppercase = ('A' <= s[idx] && s[idx] <= 'Z');
			bool is_numeric = ('0' <= s[idx] && s[idx] <= '9');

			if (is_lowercase || is_uppercase || is_numeric) {
				return idx;
			}

			idx += l2r ? 1 : -1;
		}

		return -1;
	}

	bool compare(char a, char b) {
		if (a == b) {
			return true;
		} else if ('A' <= a && 'A' <= b && ABS_DIFF(a, b) == 'a' - 'A') {
			return true;
		}
		return false;
	}
public:
	bool isPalindrome(string s) {
		int l_it = getNext(s, 0, true);
		int r_it = getNext(s, s.size() - 1, false);

		while (l_it != -1 && r_it != -1 && l_it < r_it) {
			if (!compare(s[l_it], s[r_it])) {
				return false;
			}
			l_it = getNext(s, l_it + 1, true);
			r_it = getNext(s, r_it - 1, false);
		}

		return true;
	}
};
```

## 다른 풀이

### C++

#### 정규식

> [!info]- 결과
> ![[Pasted image 20260704123159.png]]

> [!info]- 코드
> ```cpp
> class Solution {
> public:
> 	bool isPalindrome(string s) {
> 		regex re("[^a-zA-Z0-9]");
> 		string strRefined = regex_replace(s, re, "");
> 		transform(strRefined.begin(), strRefined.end(), strRefined.begin(), ::tolower);
> 		auto l = strRefined.begin(), r = strRefined.end() - 1;
> 		while (l < r) {
> 			if (*l != *r) {
> 				return false;
> 			}
> 			l++; r--;
> 		}
> 		return true;
> 	}
> };
> ```

- 옛날에 정규식으로 푼게 있어서 옮기기
	- 근데 너무 느리네