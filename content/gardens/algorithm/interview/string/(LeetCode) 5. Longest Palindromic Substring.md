---
tags:
  - mdg
  - algorithm
  - interview
  - string
date: 2026-07-10
aliases:
  - LeetCode 5
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/longest-palindromic-substring)

> [!tip] 요약
> - 후보를 골라서 확장시켜나가는 방식으로 풀면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260710093537.png]]

- Palindrome 이 될 수 있는 후보는
	1) `s[i:i]` 는 palindrome 이다.
	2) `s[i] == s[i + 1]` 이라면 `s[i:i +  1]` 도 palindrome 이다.
	3) `s[i:j]` 가 palindrome 이고 `s[i - 1] == s[j + 1]` 이라면 `s[i - 1:j + 1]` 도 palindrome 이다.
- 그렇다면, `0 <= i < n` 인 모든 `i` 에 대해
	- (1) 번 (즉, `s[i:i]`) 에서 시작해 (3) 을 적용시켜가며 확장하다보면 `i` 를 중심으로 하는 palindrome 을 모두 찾을 수 있다.
	- (2) 번을 만족한다면 (즉, `s[i:i + 1]` 이 palindrome 이라면) (3) 을 적용시켜가며 확장해 `s[i:i + 1]` 을 중심으로 하는 palindrome 을 모두 찾을 수 있다.
- 그래서 코드는:

```cpp
class Solution {
	void expand(string &s, int &l, int &r) {
		while (0 <= l && r < s.size() && s[l] == s[r]) {
			l--;
			r++;
		}

		// [l + 1, r - 1] is the longest
		l++;
		r--;
	}
public:
	string longestPalindrome(string s) {
		int n = s.size();
		int max_l = 0;
		int max_r = 0;

		for (int i = 0; i < n; i++) {
			int l, r;

			// Odd palindromes
			l = i - 1;
			r = i + 1;
			if (0 <= l && r < n && s[l] == s[r]) {
				expand(s, l, r);

				if (max_r - max_l < r - l) {
					max_r = r;
					max_l = l;
				}
			}

			// Even palindromes
			l = i;
			r = i + 1;
			if (0 <= l && r < n && s[l] == s[r]) {
				expand(s, l, r);

				if (max_r - max_l < r - l) {
					max_r = r;
					max_l = l;
				}
			}
		}

		return s.substr(max_l, max_r - max_l + 1);
	}
};
```

## 다른 풀이

### Brute force

> [!info]- 코드
> ```cpp
> class Solution {
> public:
> 	string longestPalindrome(string s) {
> 		int n = s.size();
> 		string ret = "";
>
> 		for (int i = 0; i < n; i++) {
> 			for (int l = n - i; l > 0; l--) {
> 				string sub = s.substr(i, l);
> 				string rev = sub;
> 				reverse(rev.begin(), rev.end());
> 				if (rev == sub && sub.size() > ret.size()) {
> 					ret = sub;
> 				}
> 			}
> 		}
>
> 		return ret;
> 	}
> };
> ```

- 무지성 brute force. 당연히 timeout 난다.

### BFS-like

> [!info]- 결과
> ![[Pasted image 20260710090824.png]]

> [!info]- 코드
> ```cpp
> class Solution {
> public:
> 	string longestPalindrome(string s) {
> 		int n = s.size();
> 		queue<pair<int, int>> q;
> 		pair<int, int> max = {0, 0};
>
> 		q.push({0, 0});
> 		for (int i = 1; i < n; i++) {
> 			q.push({i, i});
>
> 			if (s[i - 1] == s[i]) {
> 				q.push({i - 1, i});
> 			}
> 		}
>
> 		while (!q.empty()) {
> 			auto cur = q.front();
> 			int l = cur.first;
> 			int r = cur.second;
> 			q.pop();
>
> 			if (r - l > max.second - max.first) {
> 				max = cur;
> 			}
>
> 			if (0 <= l - 1 && r + 1 < n && s[l - 1] == s[r + 1]) {
> 				q.push({l - 1, r + 1});
> 			}
> 		}
>
> 		return s.substr(max.first, max.second - max.first + 1);
> 	}
> };
> ```

- BFS 처럼 palindrome 부호들을 전부 queue 에 넣어놓고 하나씩 꺼내며 expand 했을 때 palindrome 이면 expand 된 놈을 넣는 방식.
- 사실상 [[#최종|위]] 랑 비슷해보이는데, 시간차이는 좀 난다. 왠지는 모르겠음.