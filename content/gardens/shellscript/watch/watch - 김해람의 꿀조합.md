---
tags:
  - shellscript
  - bash-watch
date: 2024-01-30
---
## 안궁금하겠지만

- 그래도 이렇게 Bash alias 설정해 두면 편하다 (zshrc 나 bashrc 에 설정해 두자).

```bash
alias watch="watch -d -n0.5"
```

## 1. `-d` 옵션

- 이 옵션을 넣으면 뭔가 바뀔때마다 하이라이트를 해줘 어떤 것이 바뀌었는지 알기 편하다.
	- 막 번쩍번적댄다 신나부러

```bash
watch -d ${명령어}
```

- 이렇게

![[Pasted image 20240129215200.png]]

## 2. `-n` 옵션

- watch 의 기본 시간 간격 옵션은 2초인데, 이거 기다리고 있으면 진짜 열불나고 극적인 효과도 없다.
- 그래서 이 옵션으로 시간 간격을 확 줄여버리자.
	- 물론 근데 너무 줄이면 생각보다 메모리 많이 먹는다.
	- 주인장은 이번 생에 이 옵션은 외판 뼉다구 문제없는  0.5 초로 종결을 하였다.

```bash
watch -n 0.5 ${명령어}
```