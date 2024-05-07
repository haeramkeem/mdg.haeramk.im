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

## NVMeVirt 설치

### 설치 결과

- [NVMeVirt 설치 가이드](https://github.com/snu-csl/nvmevirt?tab=readme-ov-file#installation)
	- Memmap_start: `4G`
	- Memmap_size: `4G`
	- CPUs: `2,3`

### Troubleshoot # 1: MEMMAP 에러

- 다음과 같은 에러 발생:

![[Pasted image 20240421222738.png]]

- Memmap_size 를 `1G` 로 했더니 정상적으로 생성됨
- Memmap 설정 변경하며 최대로 늘릴 수 있는 size 가 얼마인지 확인

> [!info]- `chset.sh`
> ```bash
> #!/bin/sh
> 
> MEMMAP_START=$1
> MEMMAP_SIZE=$2
> 
> sudo sed -Ei 's|^GRUB_CMDLINE_LINUX="memmap=(.+) intremap=off"$|GRUB_CMDLINE_LINUX="memmap='$MEMMAP_SIZE'G\\\\\\$'$MEMMAP_START'G intremap=off"|g' /etc/default/grub
> 
> sudo update-grub
> 
> cat << EOF > up.sh
> #!/bin/sh
> sudo insmod ./nvmev.ko memmap_start=${MEMMAP_START}G memmap_size=${MEMMAP_SIZE}G cpus=2,3
> sudo journalctl -k --no-pager
> EOF
> 
> sudo reboot
> ```

> [!info]- `up.sh`
> ```bash
> #!/bin/sh
> sudo insmod ./nvmev.ko memmap_start=4G memmap_size=4G cpus=2,3
> sudo journalctl -k --no-pager
> ```

- 결론: `MEMMAP_START=4G`, `MEMMAP_SIZE=4G` 로 결정
- 설치 결과

```bash
sudo journalctl -k
```

![[Pasted image 20240422182054.png]]

### Troubleshoot # 2: Modprobe 설정

- [Arch linux module 설정 가이드](https://wiki.archlinux.org/title/Kernel_module)
	- Module 적재 설정: `/etc/modules-load.d/nvmev.conf`
	- Module 옵션 설정: `/etc/modprobe.d/nvmev.conf`

> [!info]- 수정) `chset.sh`
> ```bash
> #!/bin/sh
> 
> MEMMAP_START=$1
> MEMMAP_SIZE=$2
> 
> sudo sed -Ei 's|^GRUB_CMDLINE_LINUX="memmap=(.+) intremap=off"$|GRUB_CMDLINE_LINUX="memmap='$MEMMAP_SIZE'G\\\\\\$'$MEMMAP_START'G intremap=off"|g' /etc/default/grub
> 
> sudo update-grub
> 
> cat << EOF | sudo tee /etc/modules-load.d/nvmev.conf
> nvmev
> EOF
> 
> cat << EOF | sudo tee /etc/modprobe.d/nvmev.conf
> options nvmev memmap_start=${MEMMAP_START}G memmap_size=${MEMMAP_SIZE}G cpus=2,3
> EOF
> ```

> [!info]- `modprobe.sh`
> ```bash
> #!/bin/bash
> 
> DIRNAME=/home/toor/nvmevirt
> 
> sudo mkdir -pv /lib/modules/$(uname -r)/misc
> sudo cp ${DIRNAME}/nvmev.ko /lib/modules/$(uname -r)/misc/ \
>     && sudo depmod -a
> ```

## NVMe CLI

- [[nvme-cli - 최신 버전 설치하기|설치 과정은 이곳에서]]

## 디버깅

### 간단히 몇개의 command 날려보기

- [[nvme-cli - 디바이스 조회하기|List]]

```bash
sudo nvme list
```

> [!example]- 결과 예시
> ![[Pasted image 20240422182145.png]]

- [[nvme-cli - 로그 보기|Log]]

```bash
sudo nvme get-log /dev/nvme0 -i 2 -l 512
```

> [!example]- 결과 예시
> ![[Pasted image 20240422182220.png]]

- SMART log

```bash
sudo nvme smart-log /dev/nvme0
```

> [!example]- 결과 예시
> ![[Pasted image 20240422182257.png]]