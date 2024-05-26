---
tags:
  - Storage
  - 삽질록
  - NVMe
date: 2024-04-21
---
> [!info]- 참고한 것들
> - [논문 (FAST '23)](https://www.usenix.org/conference/fast23/presentation/kim-sang-hoon)
> - [GItHub](https://github.com/snu-csl/nvmevirt)
> - [유투브 저자직강](https://youtu.be/eV7vQyg46zc?si=USiYITI09Sdz01YZ)

> [!tip] [[NVMeVirt (1) - 설치 기록|이전 글]]

## 환경

- VM 정보
	- CPU: 4C
	- MEM: 8G
	- NIC: `10.0.0.100/24`
	- Disk: 32G
	- VM Provider: Libvirt (QEMU)
- OS 정보
	- Kernel: `5.15.0-94-generic`
	- Distro: Ubuntu 22.05 Jammy

### NVMeVirt [[S.M.A.R.T Log (NVMe)|S.M.A.R.T. log]] 기능 추적

1. [nvme smart log impl](https://github.com/snu-csl/nvmevirt/blob/main/admin.c#L180-L193)([nvme smart log iface](https://github.com/snu-csl/nvmevirt/blob/main/nvme.h#L218-L239))
2. [admin.c::nvmev_proc_admin_req](https://github.com/snu-csl/nvmevirt/blob/main/admin.c#L548-L596)
3. [admin.c::nvmev_proc_admin_sq](https://github.com/snu-csl/nvmevirt/blob/main/admin.c#L598-L617)
4. [main.c::nvmev_proc_dbs](https://github.com/snu-csl/nvmevirt/blob/main/main.c#L114-L157)
5. [main.c::nvmev_dispatcher](https://github.com/snu-csl/nvmevirt/blob/main/main.c#L159-L173)
6. [main.c::NVMEV_DISPATCHER_INIT](https://github.com/snu-csl/nvmevirt/blob/main/main.c#L175-L181)
	1. [main.c::NVMeV_init](https://github.com/snu-csl/nvmevirt/blob/main/main.c#L587-L630)
		1. <-- Module load
7. [main.c::NVMEV_DISPATCHER_FINAL](https://github.com/snu-csl/nvmevirt/blob/main/main.c#L183-L189)
	1. [main.c::NVMeV_exit](https://github.com/snu-csl/nvmevirt/blob/main/main.c#L632-L662)
		1. <-- Module stop