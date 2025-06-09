---
tags:
  - shellscript
  - bash-rsync
date: 2025-06-05
---
> [!info]- 참고한 것들
> - [스댕](https://unix.stackexchange.com/a/127355)

## TL;DR

- `rsync` 를 사용할 때 [[ssh - Remote 에 Keypair 추가하기|ssh keypair]] 를 사용하고 싶으면 아래와 같이 하면 된다:

```bash
rsync -e "ssh -i /path/to/key" src user@host:dest
```