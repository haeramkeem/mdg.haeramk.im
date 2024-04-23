---
tags:
  - 쉘스크립트
  - NVMe
date: 2024-04-23
---
## 디바이스 목록 보기

```bash
sudo nvme list
```

## NVMe Controller 정보 보기

```bash
sudo nvme id-ctrl /dev/nvme0 -H
```

- `-H`, `--human-readable`: 읽기 편하게 다 설명을 곁들인

## NVMe Namespace 정보 보기

```bash
sudo nvme id-ns /dev/nvme0n1 -H
```

- `-H`, `--human-readable`: 마찬가지로 읽기 편하게 다 설명을 곁들인