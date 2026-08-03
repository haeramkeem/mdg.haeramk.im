---
tags:
  - mdg
  - k8s-cloud
  - proxmox
  - tofu
date: 2026-07-02
aliases:
  - TF 로 GPU VM 만들기
---
> [!info] 작물 단계: #seed 

> [!info]- 참고한 것들
> - [Proxmox Wiki](https://pve.proxmox.com/wiki/PCI_Passthrough)
> - [Proxmox Forum](https://forum.proxmox.com/threads/2025-proxmox-pcie-gpu-passthrough-with-nvidia.169543/)

> [!info] 준비물
> - [[PCI Passthrough 가이드]]

## 개요

- [[PCI Passthrough 가이드|GPU Passthrough]] 로 격리된 GPU 를 Proxmox VM 에 붙여보자.

## 1. PVE Role 추가

- PVE 에서 device mapping 을 사용해야 하는데, 이건 추가적인 권한이 필요하다. 그래서 role 을 추가해준다.

```bash
pveum role add {{Role 이름}} -privs "Mapping.Modify"
```

- [[PVE - TF 사용하기|여기]] 에서 생성한 계정에 달아주면 된다.

```bash
pveum aclmod / -user {{USER}}@pve -role {{Role 이름}}
```

## 2. 정보 확인

- 우선 이 명령어를 실행해서 정보들을 쭉 뽑아본다.

```bash
pvesh get /nodes/t7910/hardware/pci --pci-class-blacklist ""
```

- 여기서 원하는 device 의 다음 정보들을 찾아준다.
	- `id`
	- `device`
	- `iommugroup`
	- `vendor`
	- `subsystem_vendor`
	- `subsystem_device`

## 3. HW mapping resource 작성

- 위에서 확인한 정보를 바탕으로 아래의 resource 를 작성해준다.

```tf
resource "proxmox_hardware_mapping_pci" "{{Resource 이름}}" {
  name = "{{이름}}"
  map = [
    {
      node         = "{{Node 이름}}"
      path         = "{{id}}"
      id           = "{{vendor}}:{{device}}"
      subsystem_id = "{{subsystem_vendor}}:{{subsystem_device}}"
      iommu_group  = {{iommugroup}}
    }
  ]
}
```

## 4. VM resource 작성

- [[PVE - TF 로 Cloud Image VM 만들기|이거]] 랑 동일한데 여기에 아래 것들을 추가해주면 된다.
	- 다만 `machine=q35`, `bios=ovmf` 를 추천한다고 한다. 이게 아니면 안되는지는 잘 모르겠지만, 궁합이 이게 제일 좋다네.

```
machine = "q35"
bios    = "ovmf"

efi_disk {
  datastore_id = "local-lvm"
}

hostpci {
  device  = "hostpci0"
  mapping = "{{이름}}"
  pcie    = true
  rombar  = false
  xvga    = false
}
```