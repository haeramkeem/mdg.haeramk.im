---
tags:
  - mdg
  - proxmox
date: 2026-03-19
---
> [!info]- 참고한 것들
> - [레딧](https://www.reddit.com/r/Proxmox/comments/1drs89s/intel_nic_e1000e_hardware_unit_hang/)

## 증상

- [[PVE - Windows 10 VM 설치|Win10 VM을 설치]] 하고 사용하던 와중에 자꾸 서버가 죽어서 커널 로그를 보니 이런게 떠있다:

```
kernel: e1000e 0000:00:19.0 nic1: Detected Hardware Unit Hang:
                                TDH                  <ac>
                                TDT                  <ef>
                                next_to_use          <ef>
                                next_to_clean        <ab>
                              buffer_info[next_to_clean]:
                                time_stamp           <1012e3d11>
                                next_to_watch        <ac>
                                jiffies              <1012eda40>
                                next_to_watch.status <0>
                              MAC Status             <40080043>
                              PHY Status             <796d>
                              PHY 1000BASE-T Status  <0>
                              PHY Extended Status    <3000>
                              PCI Status             <10>
```

- 예상컨데 서버가 꺼진건 아니고 NIC 이 hang 돼서 접속이 안됐던 것 같다.

## 해결

- 보니까 Intel e1000e NIC 에서 많이 발생하는 에러인 것 같다 ([레딧](https://www.reddit.com/r/Proxmox/comments/1drs89s/intel_nic_e1000e_hardware_unit_hang/)).
- 트래픽이 많아지면 NIC 쪽에서 뻗는 것으로 보이고, NIC offloading 을 비활성화하면 이런 문제가 안생긴다고 한다.
	- 근데 뭘 offloading 하는건지는 모르겠음.
- 해결방법은 어떤 나이스가이가 스크립트를 만들어놓아서 그냥 [이거](https://community-scripts.org/scripts/nic-offloading-fix) 쓰면 자동으로 설정된다.