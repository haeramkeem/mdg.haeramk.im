---
tags:
  - 쉘스크립트
---
> [!info] [출처](https://tldp.org/LDP/abs/html/parameter-substitution.html)

## 개요

- 이것도 진짜 편함

## TL;DR!

```bash
unset TEST
echo "${TEST?'error: variable TEST not set'}" # STDERR: 'bash: TEST: error: variable TEST not set'
```