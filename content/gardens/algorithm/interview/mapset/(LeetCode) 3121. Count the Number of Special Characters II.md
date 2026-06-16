---
tags:
  - mdg
  - algorithm
  - interview
  - mapset
date: 2026-05-28
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/count-the-number-of-special-characters-ii)

> [!tip] 요약
> - 문제 잘 읽기

## 최종

> [!info]- 결과
> ![[Pasted image 20260528201932.png]]

- [[(LeetCode) 3120. Count the Number of Special Characters I|LeetCode 3120]] 처럼, 앞에서부터 순회하며 special 한 놈을 찾아내면 된다.
- 이때 set 이 사용되는데, 아래의 코드를 보자.

```cpp {20-23,15-18}
#define bms unsigned int
#define CHECK_BMS(target, idx) (((target) >> (idx)) & 0x1)

class Solution {
public:
	int numberOfSpecialChars(string word) {
		bms lower = 0;
		bms upper = 0;
		bms special = 0;
		int cnt = 0;

		for (auto c : word) {
			if ('a' <= c && c <= 'z') {
				lower |= 1 << (c - 'a');
				if (CHECK_BMS(special, c - 'a')) {
					special ^= 1 << (c - 'a');
					cnt--;
				}
			} else {
				if (CHECK_BMS(lower, c - 'A') && !CHECK_BMS(upper, c - 'A') && !CHECK_BMS(special, c - 'A')) {
					special |= 1 << (c - 'A');
					cnt++;
				}
				upper |= 1 << (c - 'A');
			}
		}

		return cnt;
	}
};
```

- 우선 lowercase 와 uppercase 를 추적할 set 이 두개 필요하고, 이들은 각각 lowercase/uppercase letter 를 만났을 때 해당 문자가 set 에 추가된다.
- 또한 special character 는 unique 해야 하기 때문에 이놈을 추적할 set 이 하나 더 필요하고 이 또한 special character 를 발견했을 때 추가된다.
- 이때의 kick 은 이것이다:
	- `L20-L23`: 대문자를 만났을 때 (1) 이놈의 lowercase 가 lowercase set 에 추가되어있어야 하고, (2) 이놈이 아직 uppercase set 에 추가되어있지 않아야 하며 (3) 이놈이 special set 에도 추가되어있지 않다면, lowercase character 가 등장한 후 첫번째 uppercase 이기 때문에 special 이다. 이때에는 special set 에 추가하여 중복 카운팅을 방지하고, 카운트도 올린다.
	- `L15-L18`: 문제의 조건을 보면 모든 lowercase character 가 uppercase character 이전에 나와야 한다. 따라서, lowercase character 를 만났을 때 이놈이 special set 에도 등록되어 있다면, special set 에서 빼주고 카운트도 줄여줌으로서 special 지위를 박탈한다.
- 적용한 최적화는 [[Bitmap (Encoding)|BMS]] 이다: alphabet 의 개수가 32개보다 적기 때문에 사용해도 된다.