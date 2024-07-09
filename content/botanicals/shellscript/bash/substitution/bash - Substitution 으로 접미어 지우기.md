---
tags:
  - 쉘스크립트
  - bash-substitution
date: 2024-03-05
---
> [!info] [출처](https://tldp.org/LDP/abs/html/parameter-substitution.html)

## 개요

- 문자열의 접미어를 지워보자
	- 물론 [[tr - 문자 지우기|tr]] 같은 명령어를 사용할 수도 있지만
	- Bash substitution 에도 이런 기능을 제공한다

## TL;DR!

```bash
TEST='example/'
echo "${TEST%/}" # STDOUT: 'example'
```

## 좀 더 자세히?

- `%` 는 매칭되는 "가장 짧은" 접미어를 지운다

> **${var%Pattern}** Remove from $var the _shortest_ part of $Pattern that matches the _back end_ of $var.

```bash
TEST='foo'
echo "${TEST%o*}" # STDOUT: 'fo'
```

- `%%` 는 매칭되는 "가장 긴" 접미어를 지운다

> **${var%%Pattern}** Remove from $var the _longest_ part of $Pattern that matches the _back end_ of $var.

```bash
TEST='foo'
echo "${TEST%%o*}" # STDOUT: 'f'
```