---
tags:
  - 쉘스크립트
  - iptables
date: 2024-06-16
---
## TL;DR

- `172.16.20.10` 으로 가는 DNS 패킷을 `127.0.0.1:20053` 으로 보내기

```bash
sudo iptables -t nat -A OUTPUT -d 172.16.20.10 -p udp --dport 53 -j DNAT --to-destination 127.0.0.1:20053
```
