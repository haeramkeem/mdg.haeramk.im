---
tags:
  - shellscript
  - bash-journalctl
date: 2024-09-15
---
## 왜?

- Linux 의 기본 syslog (rsyslog) 가 아닌 다른 logging system 을 사용하기 위해 이것을 비활성화할 수 있다.
- 아래 방법으로 syslog 와 syslog socket 을 끌 수 있고

```bash
sudo systemctl disable --now syslog.socket rsyslog.service
```

- 아래 방법으로 [[journactl - 기본적인 사용법|journald]] 를 끌 수 있다.

```bash
sudo systemctl disable --now systemd-journald.socket systemd-journald-dev-log.socket systemd-journald.service
```