---
tags:
  - shellscript
  - bash-journalctl
date: 2024-09-15
---
> [!info]- 참고한 것들
> - [DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-use-journalctl-to-view-and-manipulate-systemd-logs)

## 시간 필터링

```bash
journalctl --since "YYYY-MM-DD HH:mm:SS"
```

## Booting 이후의 log 보기

- 부팅 ID 확인

```bash
journalctl --list-boots
```

- 원하는 부팅에 대한 log 보기: `-b` 옵션을 사용하면 된다.

```bash
journalctl -b ${BOOT_INDEX}
```