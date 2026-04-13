---
tags:
  - mdg
  - algorithm
  - interview
  - stack
date: 2026-04-13
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/daily-temperatures)

> [!tip] 요약
> - 증감 추세가 바뀌는 지점을 찾는 문제에서는 stack을 사용하자.

## 최종

> [!info]- 결과
> ![[Pasted image 20260413191528.png]]

- [[(프로그래머스) 큰 수 만들기|이 문제]] 랑 같은 문제다. 증감 추세가 바뀌는 지점을 찾는 문제에서는 stack을 사용하자.

```cpp
#define PACK(idx, temp) (((idx) << 12) | ((temp) & 0xFFF))
#define UNPACK_IDX(pack) (((pack) >> 12) & 0xFFFFF)
#define UNPACK_TEMP(pack) ((pack) & 0xFFF)

class Solution {
public:
	vector<int> dailyTemperatures(vector<int>& temperatures) {
		vector<int> ret(temperatures.size(), 0);
		stack<int> stk;

		for (int i = 0; i < temperatures.size(); i++) {
			if(stk.empty()) {
				stk.push(PACK(i, temperatures[i]));
			} else {
				while (!stk.empty() && UNPACK_TEMP(stk.top()) < temperatures[i]) {
					int idx = UNPACK_IDX(stk.top());

					ret[idx] = i - idx;
					stk.pop();
				}

				stk.push(PACK(i, temperatures[i]));
			}
		}

		return ret;
	}
};
```