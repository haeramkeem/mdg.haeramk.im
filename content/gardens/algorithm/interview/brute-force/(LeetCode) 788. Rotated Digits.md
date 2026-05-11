---
tags:
  - mdg
  - algorithm
  - interview
  - brute-force
date: 2026-05-08
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/rotated-digits)

> [!tip] 요약
> - 문제만 꼼꼼하게 읽으면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260508185014.png]]

- 3, 4, 7 을 무조건 포함하지 않고 2, 5, 6, 9 를 무조건 1개 이상 포함하는 숫자가 good 이다.

```cpp
#define DIFF	(1)
#define SAME	(2)
#define INVALID (4)

class Solution {
	static constexpr char mod_mask[10] = {
		SAME,
		SAME,
		DIFF,
		INVALID,
		INVALID,
		DIFF,
		DIFF,
		INVALID,
		SAME,
		DIFF
	};
	bool isGood(int k) {
		char mod = 0;

		while (k) {
			int digit = k % 10;
			mod |= mod_mask[digit];
			k = (k - digit) / 10;
		}

		return (!(mod & INVALID) && (mod & DIFF));
	}
public:
	int rotatedDigits(int n) {
		int cnt = 0;
		for (int k = 1; k <= n; k++) {
			if (isGood(k)) {
				cnt++;
			}
		}
		return cnt;
	}
};
```

- 위 코드의 디테일은
	- 각 digit 에 대해 rotate 했을 때 달라지는지 (`DIFF`), 같은지 (`SAME`), 아니면 유효하지 않은지 (`INVALID`) 를 bit mask 로 표현한다. 즉, `DIFF` 는 첫번째 bit 가 1이고 `SAME` 은 두번째 bit 가 1이며 `INVALID` 는 세번째 bit 가 1이다.
	- `mod_mask` array 를 통해서 각 digit 이 `DIFF` 인지, `SAME` 인지, `INVALID` 인지를 table 로 만들어두었다. 이렇게 하면 불필요한 branch 를 줄일 수 있다.