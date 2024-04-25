---
tags:
  - 쉘스크립트
  - NVMe
  - ZNS
  - nvme-cli
date: 2024-04-23
---
> [!info]- 참고한 것들
> - [Zoned Storage](https://zonedstorage.io/docs/tools/zns)

> [!tip] 여기는 명령어만 정리되어 있습니다. 실 사용 예시는 [[NVMe - ZNS 를 위한 CLI 명령어 사용해보기|ZNS 를 위한 CLI 명령어 사용해보기]] 문서를 참고해 주세용

## [[Zoned Storage Model (Storage)#State Machine|Zone 상태]] 변경하는 법

### Zone Open

```bash
sudo nvme zns open-zone /dev/nvme1n1
```

### Zone Close

```bash
sudo nvme zns close-zone /dev/nvme1n1
```

### Zone Finish

```bash
sudo nvme zns finish-zone /dev/nvme1n1
```

### Zone Reset

```bash
sudo nvme zns reset-zone /dev/nvme1n1 -s 0x0
```

- 옵션 정리
	- `-s`, `--start-lba` 로 reset 할 zone 의 SLBA 를 지정해 주거나
	- `-a`, `--select-all` 로 모든 zone 을 reset 할 수 있다.