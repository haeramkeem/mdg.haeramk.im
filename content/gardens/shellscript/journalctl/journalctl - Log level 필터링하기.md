---
tags:
  - bash-dmesg
  - shellscript
  - bash-journalctl
date: 2024-09-15
---
> [!info]- 참고한 것들
> - [Man 페이지](https://man7.org/linux/man-pages/man1/journalctl.1.html)
> - [Digital Ocean](https://www.digitalocean.com/community/tutorials/how-to-use-journalctl-to-view-and-manipulate-systemd-logs)

## TL;DR

- 특정 log level 확인

```bash
sudo dmesg --level $LOG_LEVEL
```

- 특정 Log level 보다 낮은 우선순위의 log 보기
	- 즉, `err` 을 주면 `err`, `crit`, `alert`, `emerg` level 이 출력된다.

```bash
journalctl -p $LOG_LEVEL
```

## 참고

- Log level 은 다음과 같다.

```
0: emerg
1: alert
2: crit
3: err
4: warning
5: notice
6: info
7: debug
```