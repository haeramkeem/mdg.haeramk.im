---
tags:
  - mdg
  - sw-eng
  - testing
  - coverage
date: 2026-07-18
aliases:
  - "\bDecision Coverage"
  - 결정 커버리지
---
> [!info] 작물단계: #seed

> [!info]- 참고한 것들
> - [[10. 소프트웨어 테스트 - Part 2|충남대 김현수 교수님 소프트웨어공학 강의 (Fall 2021)]]

## 란?

- *Decision Coverage*, *결정 커버리지* 라는 것은 ==모든 branch 에 대해 양 분기가 모두 실행되느냐를 의미== 한다.
	- 여기서 중요한 것은 각 branch 의 분기 조합을 검사하는 것은 아니라는 점이다. 각 branch 에 대해 양 분기가 잘 되나만 보는 것이고, 이들의 조합은 [[Path Coverage (SW  Testing)|Path Coverage]] 에서 검사한다.
	- 이해가 안되면 [[Path Coverage (SW  Testing)#비교 예시|이 예시]] 를 참고하자.
- [[Condition Coverage (SW  Testing)|Condition Coverage]] 나 [[Multiple Condition Coverage (SW  Testing)|Multiple Condition Coverage]] 랑 헷갈릴 수 있다. 이에 대한 비교는 [[Condition Coverage (SW  Testing)#비교 예시|여기]] 에서 예시를 적어두었으니 참고하자.