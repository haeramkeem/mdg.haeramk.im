---
tags:
  - shellscript
  - iptables
date: 2024-06-16
---
> [!info]- 참고한 것들
> - [어떤 문서](https://kerneltalks.com/virtualization/how-to-reset-iptables-to-default-settings)

## TL;DR

```bash
sudo iptables -t ${테이블 이름} -F
sudo iptables -t ${테이블 이름} -X
```

- 전부 다 flush 해버리고 싶다면, 이렇게 하면 된다.

```bash
sudo iptables -P INPUT ACCEPT \
    && sudo iptables -P FORWARD ACCEPT \
    && sudo iptables -P OUTPUT ACCEPT \
    && sudo iptables -F INPUT \
    && sudo iptables -F OUTPUT \
    && sudo iptables -F FORWARD \
    && sudo iptables -t nat -F \
    && sudo iptables -t mangle -F \
    && sudo iptables -F \
    && sudo iptables -X
```