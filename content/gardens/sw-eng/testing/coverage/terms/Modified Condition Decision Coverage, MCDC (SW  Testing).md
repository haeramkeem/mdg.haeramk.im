---
tags:
  - mdg
  - sw-eng
  - testing
  - coverage
date: 2026-07-18
aliases:
  - Modified Condition Decision Coverage
  - 변경 조건/결정 커버리지
  - MCDC
---
> [!info] 작물단계: #seed

> [!info]- 참고한 것들
> - [[10. 소프트웨어 테스트 - Part 2|충남대 김현수 교수님 소프트웨어공학 강의 (Fall 2021)]]

## 란?

- [[Multiple Condition Coverage (SW  Testing)|Multiple Condition Coverage]] 와 유사하게 boolean [[Expression (PL)|expr]] 들의 조합을 검사하는데, 모든 조합을 검사하는 것은 아니고 한 expr 이 바뀌었을 때 다른 코드에 어떤 영향을 주는지를 중점적으로 검사하는 방법이라고 한다.
	- 현실적으로 Multiple Condition Coverage 를 검사하긴 힘들기 때문에, 현실에서 가능한 수준의 가장 빡센 검사라고 한다.
- 구체적으로 어떻게 하는지는 아직 잘 감이 안옴.