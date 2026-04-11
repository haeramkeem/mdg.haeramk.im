---
tags:
  - mdg
  - algorithm
  - interview
  - sort
date: 2026-04-10
---
> [!info] 문제 링크
> - [프로그래머스](https://school.programmers.co.kr/learn/courses/30/lessons/42747)

> [!tip] 요약
> - 쉬운 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260410091358.png]]

- 그냥 정렬해서 문제에서 말한 조건에 부합하는 논문의 개수가 몇개인지 세면 된다.

```cpp
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

int solution(vector<int> citations) {
	int h_idx = 0;

	sort(citations.begin(), citations.end(), [](auto a, auto b) {
		return a > b;
	});

	for (int i = 0; i < citations.size(); i++) {
		if (citations[i] >= i + 1) {
			h_idx = i + 1;
		} else {
			break;
		}
	}

	return h_idx;
}
```
