---
tags:
  - mdg
  - algorithm
  - interview
  - sort
date: 2026-05-31
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/destroying-asteroids)

> [!tip] 요약
> - 생각나는대로 풀면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260531120835.png]]

- 간단하게 생각해보면, 질량이 작은 소행성부터 충돌시켰을 때 행성이 전부 받아낸다면 통과이고, 그렇지 못한다면 어떻게 해도 모든 소행성들을 다 충돌시킬 수 없다.
- 그래서 그냥 소행성들을 정렬한 뒤에 충돌시켜보면 정답을 알 수 있다.
	- 물론 결과를 보면 그렇게 빠른 코드는 아니다. $O(nlogn)$ 이기 때문인듯. 근데 코테에서 만나면 이렇게 푸는게 시간절약의 측면에서 더 효율적이다.

```cpp
class Solution {
public:
	bool asteroidsDestroyed(int mass, vector<int>& asteroids) {
		unsigned long long mass_ull = mass;

		sort(asteroids.begin(), asteroids.end(), [](auto a, auto b){
			return a < b;
		});

		for (auto a : asteroids) {
			if (mass_ull < a) {
				return false;
			}

			mass_ull += a;
		}

		return true;
	}
};
```

- 하나 고려한 점은 그냥 `int mass` 를 그대로 사용하면 overflow 가 난다. 그래서 그냥 `unsigned long long` 을 하나 선언해서 사용했다.