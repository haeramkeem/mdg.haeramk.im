---
tags:
  - 쉘스크립트
  - NVMe
  - nvme-cli
date: 2024-04-23
---
## Log entry 확인

```bash
sudo nvme get-log /dev/nvme0n1 -i 2 -l 512
```

- `-i`, `--log-id`: Log 종류 말하는 것인듯
- `-l`, `--log-len`: 읽어올 Log data 길이 (한줄: `16`)

## [[NVMe - S.M.A.R.T 로그|S.M.A.R.T Log]] 확인

```bash
sudo nvme smart-log /dev/nvme0n1
```