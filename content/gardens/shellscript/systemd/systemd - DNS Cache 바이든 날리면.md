---
tags:
  - shellscript
  - bash-systemd
date: 2025-08-04
---
> [!info]- 참고한 것들
> - [어떤 블로그](https://tecadmin.net/flush-dns-cache-ubuntu)

## TL;DR

- `systemd` 에서 DNS 를 관리하는 것은 `systemd-resolved` 이다.
- 그래서 DNS cache 를 날리고자 할때는 이놈의 명령어를 사용하면 된다.

```bash
sudo systemd-resolve --flush-caches
```