---
tags:
  - 쉘스크립트
  - bash-curl
date: 2024-01-30
---
> [!info] [출처](https://unix.stackexchange.com/a/94612)

## 개요

- [[curl - 기본 사용법|curl]] 을 사용하다 보면 장애 디버깅할 때 진짜 한없이 기다린다.
	- 그래서 [[watch - 김해람의 꿀조합|watch]] 같은 것으로 모니터링 걸어놓을 때 한번 장애나면 걍 멈춰있는다.
- 타임아웃을 걸어 문제가 생겨도 멈추게 해보자.

## TL;DR!

```bash
curl --max-time $SEC $URL
```

- 혹은

```bash
curl --connect-timeout $SEC $URL
```