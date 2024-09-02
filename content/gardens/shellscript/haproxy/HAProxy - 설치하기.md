---
tags:
  - shellscript
  - bash-haproxy
date: 2024-08-30
---
> [!info]- 참고한 것들
> - [공식 문서](https://www.haproxy.com/blog/how-to-install-haproxy-on-ubuntu)

## 설치법

- Repo

```bash
sudo apt install --no-install-recommends software-properties-common
sudo add-apt-repository ppa:vbernat/haproxy-2.4 -y
```

- Install

```bash
sudo apt-get install -y haproxy
sudo systemctl enable --now haproxy
```