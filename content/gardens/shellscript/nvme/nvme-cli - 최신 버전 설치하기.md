---
tags:
  - nvme
  - 쉘스크립트
  - nvme-cli
date: 2024-04-25
---
> [!fail]- 주의: 커널 업그레이드
> - 불확실하긴 하지만, nvme driver 설치 후 커널 버전 업그레이드시 다소 불안정하게 작동하는 것을 발견했습니다.

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