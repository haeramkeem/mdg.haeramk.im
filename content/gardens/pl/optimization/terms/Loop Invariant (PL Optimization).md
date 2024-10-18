---
tags:
  - pl
  - pl-optimization
  - terms
date: 2024-09-02
aliases:
  - Loop Invariant
---
> [!info]- 참고한 것들
> - [[16. Analysis & Optimization#2. Loop Invariant|충남대 조은선 교수님 컴파일러 강의 (Fall 2021)]]
> - [위키](https://en.wikipedia.org/wiki/Loop-invariant_code_motion)

## 란?

- Loop 중에 변하지 않는 것 (*Invariant*) 는 loop 밖으로 꺼내서 한번만 연산하게 하는 방법이다.
- 가령 아래의 다이어그램을 보자.

![[Pasted image 20240902160130.png]]
> 출처: By Mooshua1857 - Own work, CC0, https://commons.wikimedia.org/w/index.php?curid=115584861

- 위의 다이어그램에서는 `C` 와 `E` 는 `i` 에 의존하여 계속 값이 바뀌며 연산되지만, `D` 는 Loop 과는 무관하게 연산된다.
- 따라서 `D` 의 경우에는 loop 밖으로 꺼내서 한번만 연산하게 하는 것.