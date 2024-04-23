---
tags:
  - 쉘스크립트
  - NVMe
  - ZNS
date: 2024-04-23
---
> [!info]- 참고한 것들
> - [Zoned Storage](https://zonedstorage.io/docs/tools/zns)

> [!tip] 여기는 명령어만 정리되어 있습니다. 실 사용 예시는 [[NVMe - ZNS 를 위한 CLI 명령어 사용해보기|ZNS 를 위한 CLI 명령어 사용해보기]] 문서를 참고해 주세용

## [[Zoned Namespaces, ZNS (Storage)|ZNS]] 지원 기기 목록 출력

```bash
sudo nvme zns list
```

## Controller 정보 출력

```bash
sudo nvme zns id-ctrl /dev/nvme1
```

- 주의할점
	- ZNS SSD 가 아니어도 오류가 출력되지는 않는다.
	- `-H` 옵션은 없다.
	- ZASL 은 Zone Append Size Limit 을 뜻한다.

## [[NVMe Namespace (Storage)|Namespace]] 정보 출력

```bash
sudo nvme zns id-ns /dev/nvme1n1 -H
```

## [[Zoned Storage Model (Storage)#State Machine|Zone 상태]] 확인

```bash
sudo nvme zns report-zones /dev/nvme1n1 -d 10 -v
```

- 옵션 정리
	- `-d`: line 수
	- `-v`: verbose - 이 옵션 없이는 raw hex number (NVMe spec 상의) 로 출력된다.
- 결과 약어 정리
	- `SLBA`: Start LBA
	- `WP`: Write Pointer
	- `Cap`: Capacity