---
tags:
  - mdg
  - algorithm
  - interview
  - brute-force
date: 2026-06-22
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/maximum-number-of-balloons)

> [!tip] 요약
> - 쉬운 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260622101725.png]]

- 그냥 `"balloon"` 의 각 character 개수 세어주면 된다.

```cpp {4-11,21-22,24-28}
#define MIN(a, b) ((a) < (b) ? (a) : (b))

class Solution {
	static constexpr int idx_map['z' - 'a' + 1] = {
		2, 1, 0, 0, 0,
		0, 0, 0, 0, 0,
		0, 3, 0, 5, 4,
		0, 0, 0, 0, 0,
		0, 0, 0, 0, 0,
		0
	};
public:
	int maxNumberOfBalloons(string text) {
		int cnt[6] = {0};
		int min;

		for (char c : text) {
			cnt[idx_map[c - 'a']]++;
		}

		cnt[idx_map['l' - 'a']] >>= 1;
		cnt[idx_map['o' - 'a']] >>= 1;

		// Unroll
		min = MIN(cnt[1], cnt[2]);
		min = MIN(min, cnt[3]);
		min = MIN(min, cnt[4]);
		min = MIN(min, cnt[5]);

		return min;
	}
};
```

- 다만 branch 을 줄이는 최적화를 하였다.
	- `L4-L11`: `'a'` 부터 `'z'` 까지의 character 에 대해, index 를 지정해두었다. 즉, `"balloon"` 의 `'b'` 는 1번, `'a'` 는 2번, `'l'` 는 3번, `'o'` 는 4번, `'n'` 는 5번이고 나머지는 0번이다. 이것은 저 코드에서 `cnt` 카운터에서의 인덱스로 사용된다.
	- `L21-L22`: `'l'` 과 `'o'` 는 두번 등장해야 하기 때문에 카운팅된 값을 절반으로 나눠서 반영해준다.
	- `L24-L28`: 인덱스 0 을 제외한 나머지 카운터 값의 최소값이 정답이 된다. 물론 for loop 으로 계산할 수 있지만, [[Loop Unroll (PL Optimization)|Loop Unroll]] 을 해서 branch 를 줄인다.