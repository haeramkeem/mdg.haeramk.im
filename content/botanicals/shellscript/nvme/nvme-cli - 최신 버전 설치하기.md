---
tags:
  - NVMe
  - 쉘스크립트
  - nvme-cli
date: 2024-04-25
---
## TL;DR

```bash
sudo apt-get install -y meson
git clone https://github.com/linux-nvme/nvme-cli.git
cd nvme-cli
meson setup --force-fallback-for=libnvme,json-c .build
meson compile -C .build
sudo meson install -C .build
```

## 왜 이렇게 설치?

- `apt` 로 설치할 수도 있지만, 그럼 너무 옛날 버전이 설치되기 때문.