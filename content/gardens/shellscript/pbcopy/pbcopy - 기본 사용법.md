---
tags:
  - shellscript
  - bash-pbcopy
date: 2025-07-07
aliases:
  - pbcopy
---
## TL;DR

- `pbcopy` 는 Mac 터미널에서 표준입력으로 받은 것을 클립보드에 복사해주는 명령어이다.

```bash
echo "복사할 것" | pbcopy
```

### 팁들

- 이놈을 이용해 여러 function 이나 [[bash - alias 설정|alias]] 를 지정해두면 편하다.
- 가령 아래의 alias 로 현재 경로를 복사한다던가

```bash
alias pwdcopy='pwd | tr -d "\n" | pbcopy'
```

- 아래의 function 으로 파일 내용을 복사하게 할 수 있다.

```bash
function fcopy() {
    cat "$1" | pbcopy
}
```