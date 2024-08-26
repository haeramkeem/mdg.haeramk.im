---
tags:
  - 쉘스크립트
  - nvme
  - zns
  - nvme-cli
date: 2024-04-23
---
> [!info]- 참고한 것들
> - [Zoned Storage 공식 문서](https://zonedstorage.io/docs/tools/zns)

## [[Zoned Namespaces, ZNS (Storage)|ZNS]] 지원 기기 목록 출력

```bash
sudo nvme zns list
```

> [!example]- 결과 예시
> ![[Pasted image 20240423191359.png]]
## Controller 정보 출력

```bash
sudo nvme zns id-ctrl /dev/nvme1
```

- 주의할점
	- ZNS SSD 가 아니어도 오류가 출력되지는 않는다.
	- `-H` 옵션은 없다.
	- ZASL 은 Zone Append Size Limit 을 뜻한다.

> [!example]- 결과 예시
> ![[Pasted image 20240423191432.png]]

## [[Namespace (NVMe)|Namespace]] 정보 출력

```bash
sudo nvme zns id-ns /dev/nvme1n1 -H
```

> [!example]- 결과 예시
> ![[Pasted image 20240423191530.png]]
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

> [!example]- 결과 예시
> ![[Pasted image 20240423191608.png]]