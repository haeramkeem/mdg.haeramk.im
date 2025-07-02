---
tags:
  - shellscript
  - bash-rsync
date: 2025-07-01
aliases:
  - rsync
---
## TL;DR

- 그냥 이 옵션을 사용하도록 하자:

```bash
rsync -avhu --progress ${SRC} ${DST}
```

- 옵션 설명:
	- `-a`: Archive 모드. 뭔지는 잘 모르겠다.
	- `-v`: 좀 더 자세히 (Verbose)
	- `-h`: Human-readable 하게 화면 출력
	- `-u`: Modified time 을 기준으로, update 된 파일들만 전송
	- `--progress`: Progress bar 표시
- 이렇게 alias 를 설정해두어도 된다:

```bash
alias rsync='rsync -avhu --progress'
```