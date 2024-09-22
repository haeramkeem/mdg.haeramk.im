---
tags:
  - shellscript
  - bash-journalctl
date: 2024-09-15
aliases:
  - journalctl
---
> [!info]- 참고한 것들
> - [스댕](https://unix.stackexchange.com/a/408420)

## TL;DR

```bash
journalctl -e
```

- 유용한 옵션 설명
	- `-e`: Log 를 마지막부터 출력
	- `--no-pager`: Pager 비활성화
	- `-f`: Following 하기
	- `-o`: 출력 모드
		- `verbose` 로 주면 자세한 (verbose) 출력이 나온다.
	- `-n 숫자`: 몇개의 log 를 출력할지