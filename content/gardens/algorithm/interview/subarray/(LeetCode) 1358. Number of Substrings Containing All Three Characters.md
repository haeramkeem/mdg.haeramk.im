---
tags:
  - mdg
  - algorithm
  - interview/retry
  - subarray
date: 2026-06-30
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/number-of-substrings-containing-all-three-characters)

> [!tip] 요약
> - 다음에 다시 한번 풀어봐야할듯

## 최종

> [!info]- 결과
> ![[Pasted image 20260630100337.png]]

- 모르겠어서 정답보고 풀었다. 나중에 다시 풀어봐야 한다.
- 이것의 핵심은 DP 와 유사한 사고흐름으로 진행하면 된다. 즉, 길이가 $n$ 인 문자열로 만들 수 있는 정답의 개수가 $A(n)$ 일 때, $A(1)$ 부터 차근차근 해보는거다.
- 가령 문자열 `"abcabac"` 를 생각해보자.
	- $A(1)$: `"a"`. 이거로는 조건을 만족하는 문자열이 없으므로 0이다.
	- $A(2)$: `"ab"`. 이거로는 조건을 만족하는 문자열이 없으므로 0이다.
	- $A(3)$: `"abc"`. 조건을 만족하는 문자열 `"abc"` 가 있다. 1이다.
	- $A(4)$: `"abca"`. 조건을 만족하는 문자열 `"abc"`, `"bca"`, `"abca"` 가 있다. 3이다.
		- 여기서 멈춰서 생각해 보면, $A(4)$ 는 $A(3)$ 에 "마지막이 `a` 로 끝나고 조건을 만족하는 substring 의 개수" 를 더해준 것이다. 즉, $A(3)$ 인 1에다가 새로 추가된 `a` 로 끝나는 substring 2개가 더해져 결과가 3이 된다.
		- 좀 더 generalize 하면 마지막 index 까지 포함하는 substring 중에서 조건을 만족하는 substring 의 개수가 더해진다.
		- 그럼 이걸 어떻게 알아낼 수 있을까? 그것은 각 알파벳 `a`, `b`, `c` 가 마지막으로 등장한 index 를 기억해 두고, 이 index 들의 최소값 +1 이 정답이 된다.
		- 예를 들어 위 문자열의 경우에는,
			- `a` 는 index 0, 3 에서 등장했기 때문에 3을 기억해둔다.
			- `b` 는 index 1 에서 등장했기 때문에 1을 기억해둔다.
			- `c` 는 index 2 에서 등장했기 때문에 2을 기억해둔다.
			- 그럼 이 3, 1, 2 중 최솟값은 1이다. 이 말은, `[index 1 ~ 끝까지]` 가 길이가 가장 작은 substring 이고, 이것을 오른쪽으로 확장시킨 substring 들은 모두 조건을 만족하기 때문에, 총 substring 의 개수는 `index 최소값(1) + 1 == 2` 가 되는 것이다.
- 그래서 이걸 코드로 구현하면 다음과 같다.

```cpp
#define MIN2(a, b) ((a) < (b) ? (a) : (b))
#define MIN3(a, b, c) (MIN2(MIN2((a), (b)), (c)))

class Solution {
public:
	int numberOfSubstrings(string s) {
		int cnt[3] = {-1, -1, -1};
		int ret = 0;

		for (int i = 0; i < s.size(); i++) {
			cnt[s[i] - 'a'] = i;
			ret += MIN3(cnt[0], cnt[1], cnt[2]) + 1;
		}

		return ret;
	}
};
```

- 여기서 한가지 크랙은 저 `cnt[3]` 의 초기값을 `-1` 로 초기화시키는 것이다.
	- `index 최소값 + 1` 을 더해나가야 하기 때문에, 아직 등장하지 않은 알파벳에 대한 index 를 `-1` 로 해둔다면, 알파벳이 모두 등장하지 않았을 때의 index 최소값은 항상 `-1` 이고 그래서 이런 경우에는 0이 더해진다.
	- Branch 를 줄이는 트릭인것