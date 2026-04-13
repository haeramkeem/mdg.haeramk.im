---
tags:
  - mdg
  - algorithm
  - interview
  - stack
date: 2026-04-13
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/decode-string)

> [!tip] 요약
> - 괄호쌍은 stack이다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260413195347.png]]

- Stack 으로 nested인 경우에 대응해주고
- 각 문자가 여/닫는 괄호인지, 숫자인지, 알파벳인지에 따라 알맞게 처리해주면 된다.

```cpp
struct Unit {
	int k;
	string str;
};

class Solution {
public:
	string decodeString(string s) {
		stack<Unit> stk;
		string buf = "";
		string ret = "";

		for (int i = 0; i < s.size(); i++) {
			if (s[i] == '[') {
				stk.push({stoi(buf), ""});
				buf = "";
			} else if (s[i] == ']') {
				Unit top = stk.top();
				stk.pop();

				if (!stk.empty()) {
					for (int j = 0; j < top.k; j++) {
						stk.top().str += top.str;
					}
				} else {
					for (int j = 0; j < top.k; j++) {
						ret += top.str;
					}
				}
			} else if ('0' <= s[i] && s[i] <= '9') {
				buf += s[i];
			} else {
				if (!stk.empty()) {
					stk.top().str += s[i];
				} else {
					ret += s[i];
				}
			}
		}

		return ret;
	}
};
```

## 다른 코드 (C++)

> [!info]- 결과
> ![[Pasted image 20260413195512.png]]

> [!info]- 코드
> ```cpp
> class Solution {
> public:
> 	string decodeString(string s) {
> 		stack<string> chStk, nStk;
> 		chStk.push("");
> 		nStk.push("");
> 		for(const char& ch : s) {
> 			if('a' <= ch && ch <= 'z') {
> 				string t = chStk.top();
> 				chStk.pop();
> 				chStk.push(t + ch);
> 			} else if(ch == '[') {
> 				chStk.push("");
> 				nStk.push("");
> 			} else if(ch == ']') {
> 				string t = chStk.top();
> 				chStk.pop();
>
> 				nStk.pop();
> 				int rep = stoi(nStk.top());
> 				nStk.pop();
> 				nStk.push("");
>
> 				string base = chStk.top();
> 				chStk.pop();
>
> 				for(int i = 0; i < rep; i++) {
> 					base += t;
> 				}
>
> 				chStk.push(base);
> 			} else {
> 				string t = nStk.top();
> 				nStk.pop();
> 				nStk.push(t + ch);
> 			}
> 		}
>
> 		return chStk.top();
> 	}
> };
> ```

- 이전에 Stack 두개로 구현한 코드가 있어서, 여기로 옮겨버리기