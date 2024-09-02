---
tags:
  - shellscript
  - bash-tr
date: 2024-03-05
---
## 개요

- 문자열에서 지정한 모든 문자 지우기

## TL;DR!

- `-d` 옵션을 사용하면 된다

```bash
echo good | tr -d 'o' # STDOUT: 'gd'
```