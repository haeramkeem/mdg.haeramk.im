---
tags:
  - mdg
  - sw-eng
  - testing
  - coverage
date: 2026-07-18
aliases:
  - Condition Coverage
  - 조건 커버리지
---
> [!info] 작물단계: #seed

> [!info]- 참고한 것들
> - [[10. 소프트웨어 테스트 - Part 2|충남대 김현수 교수님 소프트웨어공학 강의 (Fall 2021)]]

## 란?

- *Condition Coverage*, *조건 커버리지* 라는 것은 ==branch 내의 모든 boolean expr 에 대해 true, false 가 테스트되었는가== 를 의미한다.
	- 여기서 중요한 것은 모든 boolean [[Expression (PL)|expr]] 의 `true`, `false` 조합을 검사하지는 않는다는 것이다. 이런 모든 조합을 검사하는건 [[Multiple Condition Coverage (SW  Testing)|Multiple Condition Coverage]] 이다.
	- 이건 아래의 [[#비교 예시|coverage 비교 예시]] 에서 알아보자.

## 비교 예시

- 유사한 coverage 들과 헷갈릴 수 있어서 정리해보자.
	- 가령 `if (a || b)` 의 경우에는 [[Decision Coverage (SW  Testing)|Decision Coverage]] 에서는 `a || b` 의 최종 결과가 `true`, `false` 인 경우 총 2개가 검사된다.
	- 하지만 *Condition Coverage* 의 경우에는 `a` 가 `true`, `false` 인 경우 그리고 `b` 가 `true`, `false` 인 경우가 검사된다. 여기서 중요한 것은 `a == true || b == false`, `a == false || b == true` 만 검사해도 된다는 것이다. 어쨋든 `a` 와 `b` 각각에 대해 `true` 와 `false` 가 한번씩 등장했으므로.
	- 그리고 [[Multiple Condition Coverage (SW  Testing)|Multiple Condition Coverage]] 에서는 `a == true || b == true`, `a == true || b == false`, `a == false || b == true`, `a == false || b == false` 이 네가지가 모두 검사된다.