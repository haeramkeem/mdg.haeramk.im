---
tags:
  - mdg
  - sw-eng
  - testing
  - coverage
date: 2026-07-18
aliases:
  - Path Coverage
  - 경로 커버리지
---
> [!info] 작물단계: #seed

> [!info]- 참고한 것들
> - [[10. 소프트웨어 테스트 - Part 2|충남대 김현수 교수님 소프트웨어공학 강의 (Fall 2021)]]

## 란?

- *Path Coverage*, *경로 커버리지* 라는 것은 ==모든 branch 에 대해 모든 분기 조합이 실행되느냐== 를 의미한다.

## 비교 예시

- 근데 뭔가 [[Decision Coverage (SW  Testing)|Decision Coverage]] 랑 비슷해보인다. 이것과의 결정적인 차이는 `if` branch 가 여러번 등장했을 때이다.
- 가령 `1번` branch 와 `2번` branch 가 있다고 해보자.
	- 그럼 Decision Coverage 에서는 `1번=true, 2번=false` 인 경우와 `1번=false, 2번=true` 인 경우를 확인하면 된다. 어쨋든 각각에 대해 `true` 와 `false` 가 한번씩 나왔으니까.
	- 하지만 *Path Coverage* 에서는 `1번=true, 2번=true`, `1번=true, 2번=false`, `1번=false, 2번=true`, `1번=false, 2번=false` 인 경우 모두 확인해야 한다.
- 즉, 약간 [[Condition Coverage (SW  Testing)|Condition Coverage]] 와 [[Multiple Condition Coverage (SW  Testing)|Multiple Condition Coverage]] 간의 차이와 유사하다고 생각하면 된다.