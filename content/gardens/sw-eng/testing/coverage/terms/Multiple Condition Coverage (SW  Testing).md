---
tags:
  - mdg
  - sw-eng
  - testing
  - coverage
date: 2026-07-18
aliases:
  - Multiple Condition Coverage
  - 다중 조건 커버리지
---
> [!info] 작물단계: #seed

> [!info]- 참고한 것들
> - [[10. 소프트웨어 테스트 - Part 2|충남대 김현수 교수님 소프트웨어공학 강의 (Fall 2021)]]

## 란?

- *Multiple Condition Coverage*, *다중 조건 커버리지* 라는 것은 ==branch 내의 모든 boolean expr 에 대해 가능한 모든 true, false 조합이 검사되었는가== 를 의미한다.
	- 그래서 [[Expression (PL)|expr]] 이 $n$ 개 있으면, 검사해야 할 경우의 수는 $O(2^n)$ 가 된다.
- [[Condition Coverage (SW  Testing)|Condition Coverage]] 혹은 [[Decision Coverage (SW  Testing)|Decision Coverage]] 와 헷갈린다면, [[Condition Coverage (SW  Testing)#비교 예시|이 예시]] 를 참고하자.