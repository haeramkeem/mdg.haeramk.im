---
tags:
  - NVMe
  - nvme-cli
  - 쉘스크립트
date: 2024-04-25
---
## TL;DR

### Write

```bash
echo 'data' | sudo nvme write /dev/nvme*n* -z 512 -s 0 -V
```

- 옵션 정리
	- `-z`, `--data-size`: 입력할 데이터 청크 크기 (바이트)
	- `-s`, `--start-block`: 데이터 시작 주소 ([[Logical Block Addressing, LBA (Storage)|LBA]])
	- `-V`, `--show-command`: 디바이스로 전달된 command 표시

> [!example]- 결과 예시
> ![[Pasted image 20240425220008.png]]

### Read

```bash
sudo nvme read /dev/nvme*n* -z 512 -s 0 -V
```

- 옵션 정리
	- `-z`, `--data-size`: 입력할 데이터 청크 크기 (바이트)
	- `-s`, `--start-block`: 데이터 시작 주소 ([[Logical Block Addressing, LBA (Storage)|LBA]])
	- `-V`, `--show-command`: 디바이스로 전달된 command 표시

> [!example]- 결과 예시
> ![[Pasted image 20240425220118.png]]