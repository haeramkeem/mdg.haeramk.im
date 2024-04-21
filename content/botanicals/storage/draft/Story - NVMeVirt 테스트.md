---
tags:
  - Storage
  - 삽질록
date: 2024-04-21
---

- VM 정보
	- CPU: 4C
	- MEM: 8G
	- NIC: `10.0.0.100/24`
	- Disk: 32G
- [NVMeVirt 설치 가이드](https://github.com/snu-csl/nvmevirt?tab=readme-ov-file#installation)
	- Memmap_start: `2G`
	- Memmap_size: `6G`
	- CPUs: `2,3`
- 하지만 다음과 같은 에러 발생:

![[Pasted image 20240421222738.png]]