---
tags:
  - shellscript
  - bash-expr
date: 2024-03-05
---
> [!info] [출처](https://linuxhint.com/bash_arithmetic_operations)

## 개요

- 제곧내

## TL;DR!

- 표준 출력으로 보내기

```bash
expr 10 + 30
expr 30 % 9
```

- 변수에 저장하기

```bash
myVal1=`expr 30 / 10`
myVal2=$( expr 30 - 10 )
```

## 조심할 점

- `expr` 은 arg 로 입력을 받기에, 문자열 (`''`, `""`) 로 입력하거나 띄어쓰기 없이 입력하면 안된다.
- 즉, 아래처럼 하면 안된다는 것

```bash
expr '10 + 30'  # STDOUT: '10 + 30'
expr "10 + 30"  # STDOUT: '10 + 30'
expr 10+30      # STDOUT: '10+30'
```