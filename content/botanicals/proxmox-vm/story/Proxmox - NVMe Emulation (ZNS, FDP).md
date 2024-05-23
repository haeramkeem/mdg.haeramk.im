---
tags:
  - 삽질록
  - Proxmox
  - NVMe
date: 2024-04-23
---
> [!info]- 참고한 것들
> - [QEMU 공식문서](https://qemu-project.gitlab.io/qemu/system/devices/nvme.html)

## 개요

- [[Proxmox - NVMe Emulation for VM|지난번]] 에 이어서 [[Zoned Namespaces, ZNS (Storage)|ZNS SSD]] 와 [[Flexible Data Placement, FDP (Storage)|FDP SSD]] 도 emulate 해보자
- 깔끔하게 하기 위해 List 로 parameter 들을 주입해 주었는데 그러니까 qemu parameter string 을 qm arg 로 인식해서 다음와 같은 꼼수를 사용했다:

```bash
sh -c "qm set ${VMID} --args '$(echo ${PARAMS[@]})'"
```

## ZNS

- 우선 ZNS SSD 를 위한 raw img 부터 생성

```bash
qemu-img create -f raw /path/to/zns.raw 32G
```

- [[Namespace (NVMe)|NVMe Namespace]] device 에 `zoned=on` 설정을 넣어줘야 ZNS 가 되기 때문에 `nvme` device 에 추가적으로 `nvme-ns` 도 생성

```bash
ZNS_PARAMS=(
	-device nvme,id=zns-0-ctrl,serial=QEMU_ZNS_0
	-device nvme-ns,drive=zns-0,zoned=on
	-drive format=raw,file=/path/to/zns.raw,if=none,id=zns-0
)

sh -c "qm set ${VMID} --args '$(echo ${ZNS_PARAMS[@]})'"
```

## FDP

- FDP SSD 를 위한 raw img 생성

```bash
qemu-img create -f raw /path/to/fdp.raw 32G
```

- NVMe Subsystem 에 `fdp=on` 설정을 넣어줘야 FDP SSD 가 되기 때문에 NVMe Subsysem, NVMe Namespace, NVMe 총 3개의 device 생성
	- 여기서는 [[Flexible Data Placement, FDP (Storage)#Reclaim Unit Handle (RUH)|RUH]] 개수는 16개,
	- [[Flexible Data Placement, FDP (Storage)#Reclaim Group (RG)|RG]] 개수는 8개,
	- NVMe Namespace 에는 RUH 0~7 총 8개를 할당하였다.

```bash
FDP_PARAMS=(
	-device nvme-subsys,id=fdp-0-subsys,nqn=subsys0,fdp=on,fdp.nruh=16,fdp.nrg=8
	-device nvme,id=fdp-0-ctrl,serial=QEMU_FDP_0,subsys=fdp-0-subsys
	-device nvme-ns,drive=fdp-0,fdp.ruhs=0-7
	-drive format=raw,file=/path/to/fdp.raw,if=none,id=fdp-0
)

sh -c "qm set ${VMID} --args '$(echo ${FDP_PARAMS[@]})'"
```

## 합쳐부러

```bash
# Conventional SSD
CNS_PARAMS=(
	-drive format=raw,file=/path/to/cns.raw,if=none,id=cns-0
	-device nvme,drive=cns-0,serial=QEMU_CNS_0
)

# ZNS SSD
ZNS_PARAMS=(
	-device nvme,id=zns-0-ctrl,serial=QEMU_ZNS_0
	-device nvme-ns,drive=zns-0,zoned=on
	-drive format=raw,file=/path/to/zns.raw,if=none,id=zns-0
)

# FDP SSD
FDP_PARAMS=(
	-device nvme-subsys,id=fdp-0-subsys,nqn=subsys0,fdp=on,fdp.nruh=16,fdp.nrg=8
	-device nvme,id=fdp-0-ctrl,serial=QEMU_FDP_0,subsys=fdp-0-subsys
	-device nvme-ns,drive=fdp-0,fdp.ruhs=0-8
	-drive format=raw,file=/path/to/fdp.raw,if=none,id=fdp-0
)

sh -c "qm set 102 --args '$(echo ${CNS_PARAMS[@]} ${ZNS_PARAMS[@]} ${FDP_PARAMS[@]})'"
```