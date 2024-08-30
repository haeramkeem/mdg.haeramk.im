---
tags:
  - shellscript
  - bash-env
date: 2024-03-05
---
## 개요

- 파일에서 환경변수 읽어오기

## TL;DR!

- `.` 는 환경 변수 혹은 함수들을 import 하는 POSIX 표준이다

```bash
. ./cat $FILE
```

- `source` 는 `.` 의 alias 이다 (bash 와 zsh 등에서는 가능, sh 에서는 안됨)

```bash
source ./$FILE
```