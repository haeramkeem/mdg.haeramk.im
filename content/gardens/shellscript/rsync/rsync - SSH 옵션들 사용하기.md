---
tags:
  - shellscript
  - bash-rsync
date: 2025-06-05
---
> [!info]- 참고한 것들
> - [스댕](https://unix.stackexchange.com/a/127355)

## TL;DR

- [[rsync - 기본 사용법|rsync]] 를 사용할 때 ssh option 들을 사용하고 싶으면 `-e` 옵션을 사용하면 된다.
- 가령 [[ssh - Remote 에 Keypair 추가하기|ssh keypair]] 를 사용하고 싶으면 ssh 의 `-i` 옵션을 아래와 같이 하면 된다:

```bash
rsync -e "ssh -i /path/to/key" src user@host:dest
```

- 또한 22 가 아닌 다른 port 를 사용하고 싶으면 ssh 의 `-p` 옵션을 아래와 같이 사용하면 된다.

```bash
rsync -e "ssh -p 포트번호" src user@host:dest
```