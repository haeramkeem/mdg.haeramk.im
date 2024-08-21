---
tags:
  - 쉘스크립트
  - bash-ip
date: 2024-08-16
---
> [!info]- 참고한 것들
> - [라즈베리파이 포럼](https://forums.raspberrypi.com/viewtopic.php?t=337792)

## 빠르게 TL;DR

- Routing table 을 보는 것은

```bash
ip r
```

- Entry 를 추가하는 것은

```bash
ip r add ${IP}/${CIDR} via ${GATEWAY}
```

- 참고) `ip r` 은 `ip route` 의 alias 이다.