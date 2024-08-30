---
tags:
  - shellscript
  - bash-ln
date: 2024-07-09
---
> [!info]- 참고한 것들
> - [어떤 글](https://linuxize.com/post/how-to-remove-symbolic-links-in-linux/)

## TL;DR

- 그냥 `rm` 으로 지워도 된다.

```bash
rm /path/to/symlink
```

- 아니면 이걸로도 가능

```bash
unlink /path/to/symlink
```