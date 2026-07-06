---
tags:
  - mdg
  - algorithm
  - interview
  - brute-force
date: 2026-07-02
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/add-binary)

> [!tip] 요약
> - 쉬운 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260702100132.png]]

- 이 문제도 [[(LeetCode) 66. Plus One|LeetCode 66]] 처럼 carry 만 잘 해주면 된다.

```cpp
class Solution {
public:
	string addBinary(string a, string b) {
		int n_a = a.size();
		int n_b = b.size();
		int carry = 0;
		string ret = "";

		for (int i = 0; ; i++) {
			int i_a = n_a - i - 1;
			int i_b = n_b - i - 1;
			int buf = carry;
			if (0 <= i_a && 0 <= i_b) {
				buf += (a[i_a] - '0') + (b[i_b] - '0');
				ret.push_back((buf & 0x1) + '0');
				carry = buf >> 1;
			} else if (0 <= i_a) {
				buf += (a[i_a] - '0');
				ret.push_back((buf & 0x1) + '0');
				carry = buf >> 1;
			} else if (0 <= i_b) {
				buf += (b[i_b] - '0');
				ret.push_back((buf & 0x1) + '0');
				carry = buf >> 1;
			} else {
				if (carry) {
					ret.push_back((carry & 0x1) + '0');
				}
				break;
			}
		}

		reverse(ret.begin(), ret.end());

		return ret;
	}
};
```
