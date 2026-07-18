---
tags:
  - mdg
  - sw-eng
  - testing
  - coverage
date: 2026-07-18
aliases:
  - Condition Decision Coverage
  - 조건/결정 커버리지
  - CDC
---
> [!info] 작물단계: #seed

> [!info]- 참고한 것들
> - [[10. 소프트웨어 테스트 - Part 2|충남대 김현수 교수님 소프트웨어공학 강의 (Fall 2021)]]

## 란?

- Branch `if (a || b)` 에 대해, 다른 coverage 들을 잠깐 보자.
	- [[Decision Coverage (SW  Testing)|Decision Coverage]] 에서는 `a || b` 가 `true` 인 경우와 `false` 인 경우만 검사하면 된다.
	- [[Condition Coverage (SW  Testing)|Condition Coverage]] 에서는 `a` 와 `b` 가 `true` 인 경우와 `false` 인 경우 각각만 검사하면 된다.
	- 그럼 Condition Coverage 에서는 `a == true || b == false`, `a == false || b == true` 인 경우만 검사해도 된다. 근데 이렇게만 하면 Decision Coverage 입장에서는 `a || b == true` 하나만 검사한 셈이다.
- 그래서 Condition Coverage 를 하되, Decision Coverage 도 충족시키게 하는 것이 *Condition Decision Coverage*, *CDC* 이다.
	- 위의 Condition Coverage 예시에서는 저 두개에 `a == false || b == false` 만 추가해주면 *CDC* 가 된다.