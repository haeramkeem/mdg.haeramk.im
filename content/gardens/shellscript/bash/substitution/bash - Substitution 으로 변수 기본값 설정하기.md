---
tags:
  - 쉘스크립트
  - bash-substitution
date: 2024-03-05
---
> [!info] [출처](https://tldp.org/LDP/abs/html/parameter-substitution.html)

## 개요

- 이거 진짜 편함

## TL;DR!

```bash
unset TEST
echo ${TEST}         # STDOUT: null
echo ${TEST:='good'} # STDOUT: 'good'
echo ${TEST}         # STDOUT: 'good'
```

## 여러 차이점들,,

- 뭐 [출처](https://tldp.org/LDP/abs/html/parameter-substitution.html) 에 따르면 `=`, `:=`, `-`, `:-` 모두 살짝은 다르게 작동한다고 한다
- 근데 주인장은 그냥 [Go 문법](https://gobyexample.com/variables) 과 비슷한 `:=` 를 많이 사용함
- 더 자세한 차이점을 알고 싶으면 [출처](https://tldp.org/LDP/abs/html/parameter-substitution.html) 를 읽어 보시라