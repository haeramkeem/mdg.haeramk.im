---
tags:
  - 쉘스크립트
  - bash-curl
date: 2024-01-30
---
> [!info] [출처](https://serverfault.com/a/338641)

## 개요

- 일반적인 웹 브라우져와는 다르게, [[curl - 기본 사용법|curl]] 는 기본적으로 Redirect 를 하지 않는다.
	- 즉, HTTP 300번대 응답이 와도 그냥 그러려니 하지 여기서 추가적으로 Redirect 를 따라가지 않는다.
- 그래서 Redirect 응답을 따라가려면 요래 하면 된다.

## TL;DR!

```bash
curl -L www.example.com
```