---
tags:
  - shellscript
  - bash-ln
date: 2024-07-09
---
> [!info]- 참고한 것들
> - [스댕](https://stackoverflow.com/a/1951752)

## TL;DR

- 새로 생성 (이미 있으면 에러난다.)

```bash
ln -s /path/to/file /path/to/symlink
```

- 이미 있어도 그냥 생성

```bash
ln -sf /path/to/file /path/to/symlink
```