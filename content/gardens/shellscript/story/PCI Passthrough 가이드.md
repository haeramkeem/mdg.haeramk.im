---
tags:
  - mdg
  - shellscript
  - story
date: 2026-08-02
aliases:
  - GPU Passthrough
  - PCI Passthrough
---
> [!info] 작물 단계: #seed 

> [!info]- 참고한 것들
> - [Proxmox Wiki](https://pve.proxmox.com/wiki/PCI_Passthrough)
> - [Proxmox Forum](https://forum.proxmox.com/threads/2025-proxmox-pcie-gpu-passthrough-with-nvidia.169543/)

> [!info] Device/환경
> - 살다 보면 GPU 가 아닌 다른 device 를 이렇게 passthrough 할 일도 생기겠지만, 가장 흔하게 하는건 GPU 다. 그래서 NVIDIA GPU 기준으로 설명한다.
> - 그리고 Intel CPU 기준이다. AMD 는 직접 검색해보시길.

> [!info] 범위
> - VM provider 별로 PCI 를 VM 에 붙이는 방법은 다르다.
> - 그래서 여기서 설명하는건 PCI 장치를 격리해서 `vfio` 드라이버가 붙도록 하는 것 까지다.

## 개요

- 잊을만 하면 하게 되는 PCI passthrough. 아예 작물로 심어버리자.

## 1.GPU 정보 확인

- 우선 사용하려고 하는 GPU 의 정보를 확인하자.

```bash
lspci -nn | grep -i nvidia
```

- 이걸 실행하면 아래와 같은 결과가 나온다. 두개를 확인하면 된다.
	- PCI address: 맨 앞에 나오는 `DD:DD` 형식의 숫자들이다.
	- Vendor/device ID: `XXXX:XXXX` 형식의 hex 숫자들이다.

```
DD:DD.0 VGA compatible controller ... NVIDIA Corporation ... [XXXX:XXXX] ...
```

- 일반 소비자용 GPU 의 경우에는 Audio 까지 두개가 뜰 수 있다.

```
DD:DD.0 VGA compatible controller ... NVIDIA Corporation ... [XXXX:XXXX] ...
DD:DD.1 Audio device ... NVIDIA Corporation ... High Definition Audio Controller [XXXX:XXXX] (rev a1)
```

## 2. GRUB 설정

- GRUB 설정을 수정해야 한다.

```bash
vi /etc/default/grub
```

- 그럼 이런 줄이 보일거다.

```
GRUB_CMDLINE_LINUX_DEFAULT="..."
```

- 여기에 `intel_iommu=on iommu=pt` 를 추가해준다.
	- `iommu=pt` 는 필수는 아닌데, 하면 좋다고 한다. [[Input-output Memory Management Unit, IOMMU (OS)|IOMMU]] 를 passthrough 모드로 설정하는거다.

```
GRUB_CMDLINE_LINUX_DEFAULT="... intel_iommu=on iommu=pt"
```

- 업데이트

```bash
update-grub
```

## 3. 모듈 설정

- 일단 GPU 가 `vfio` 를 사용할 수 있도록 기본 드라이버들을 전부 비활성화해준다.

```bash
cat << EOF | tee /etc/modprobe.d/nvidia-blacklist.conf
blacklist nouveau
blacklist nvidia*
EOF
```

- 그리고 `vfio` 설정을 해준다.
	- 여기서 `XXXX:XXXX` 는 위에서 확인한 vendor/device ID 다.
	- 이때 여러개를 넣어야 된다면 (가령 GPU 여러개 혹은 audio 까지) comma-separated 로 적으면 된다: `ids=XXXX:XXXX,XXXX:XXXX`

```bash
cat << EOF | tee /etc/modprobe.d/vfio.conf
options vfio-pci ids=XXXX:XXXX disable_vga=1
EOF
```

- 마지막으로 `vfio` 드라이버 모듈이 재부팅해도 로드될 수 있도록 해준다.

```bash
cat << EOF | tee /etc/modules-load.d/vfio.conf
vfio
vfio_iommu_type1
vfio_pci
EOF
```

- 업데이트

```bash
update-initramfs -u
```

## 4. 재부팅 후 확인

- 재부팅해주자.

```bash
reboot
```

### 4-1. IOMMU 확인

- 부팅되면, 커널 메세지를 확인한다.

```bash
dmesg | grep -e DMAR -e IOMMU
```

- 이런 애들이 있으면 된다.

```
[시간] DMAR: IOMMU enabled
[시간] DMAR-IR: Enabled IRQ remapping in xapic mode
[시간] DMAR: Intel(R) Virtualization Technology for Directed I/O
```

### 4-2. VFIO 확인

- `vfio` 모듈도 있는지 확인

```bash
lsmod | grep vfio
```

- 뭐 이런식으로 나오면 된다.

```
vfio_pci              ...  0
vfio_pci_core         ...  1 vfio_pci
irqbypass             ...  2 vfio_pci_core,kvm
vfio_iommu_type1      ...  0
vfio                  ...  4 vfio_pci_core,vfio_iommu_type1,vfio_pci
iommufd               ...  1 vfio
```

### 4-3. Device driver 확인

- 그리고 device 가 어떤 driver 를 사용하고 있는지 확인한다.

```bash
lspci -nnk -d XXXX:XXXX | grep driver
```

- 이렇게 나와야 한다.

```
Kernel driver in use: vfio-pci
```