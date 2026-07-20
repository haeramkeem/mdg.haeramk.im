---
tags:
  - mdg
  - database
  - data-model
  - relational-model
  - normalization
date: 2026-07-18
aliases:
  - Functional Dependency
  - FD
  - 결정자
  - 비결정자
  - Determinant
  - Dependant
---
> [!info]- 작물 단계: #seed  

> [!info]- 참고한 것들
> - [위키](https://en.wikipedia.org/wiki/Functional_dependency)

## 란?

- 한 [[Record (Relational Model)|Attribute]] set 이 다른 attribute set 의 값들을 '결정' 할 때, 이 둘 간에는 *Functional Dependency* (*FD*) 가 있다고 한다.
- 기호로는 $\rightarrow$ 로 표기한다: attribute set $A$ 가 다른 attribute set $B$ 를 '결정' 한다면,

$$
A \rightarrow B
$$

- 이때 결정 '하는' attribute set ($A$) 을 *Determinant* (*결정자*) 라고 하고
- 결정 '받는' attribute set ($B$) 을 *Dependant* (*비결정자*) 라고 한다.