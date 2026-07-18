---
tags:
  - mdg
  - sw-eng
  - coupling
date: 2026-07-18
aliases:
  - Content Coupling
  - 내용 결합도
---
> [!info] 작물단계: #seed

> [!info]- 참고한 것들
> - [[07. 아키텍쳐 디자인|충남대 김현수 교수님 소프트웨어공학 강의 (Fall 2021)]]

## 란?

- 한 모듈이 다른 모듈의 데이터를 '직접' 수정하도록 되어 있으면 *Content Coupling* (*내용 결합도*) 가 높다고 한다.
- 대표적인게 Class 의 field 를 getter/setter 등의 method 를 이용하지 않고 `obj.field` 에 직접 접근해 수정하는 경우이다.