---
tags:
  - shellscript
  - bash-ip
date: 2024-07-09
---
> [!info]- 참고한 것들
> - [밸덩](https://www.baeldung.com/linux/remove-ip-interface)

## TL;DR

```bash
ip addr del ${IP_CIDR} dev ${DEVICE_NAME}
```