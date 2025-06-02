---
tags:
  - shellscript
  - bash-tar
date: 2024-07-03
---
> [!info]- 참고한 것들
> - [스댕](https://unix.stackexchange.com/a/85195)

## TL;DR

- `.tar.gz` 파일을 다운로드 받을 일이 많이 있는데, 이때 압축파일을 다운받는 동시에 압축해제하는 방법은 아래와 같다.
	- 원리는 간단하다.
	- 일단 `wget` 을 할 때 `-q` 로 다운로드 status 같은 자질구레한 것들은 다 끄고,
	- `-O -` 로 다운로드 한 것을 바로 표준출력으로 내보낸 다음,
	- `tar` 에서는 표준입력 (`-`) 으로 받은 것을 바로 압축해제 하게 하는 것.

```bash
wget -qO- your_link_here | tar -xzvf -
```