---
tags:
  - 삽질록
  - Proxmox
  - NVMe
date: 2024-04-22
---
> [!info]- 참고한 것들
> - [QEMU 공식 문서](https://qemu-project.gitlab.io/qemu/system/devices/nvme.html)
> - [Frankenmichl 블로그](https://blog.frankenmichl.de/2018/02/13/add-nvme-device-to-vm/)
> - [Just another Linux geek 블로그](https://blog.christophersmart.com/2019/12/18/kvm-guests-with-emulated-ssd-and-nvme-drives/)
> - [Proxmox arg 주입 방법](https://forum.proxmox.com/threads/additional-command-line-parameters-to-kvm.52812/)
> - [Proxmox arg GUI 로 주입 (안된다더라)](https://forum.proxmox.com/threads/qm-args-in-gui.89553/)

## TL;DR

```bash
qemu-img create -f raw /path/to/myblock.raw 10G
qm set 102 --args '-drive format=raw,file=/path/to/myblock.raw,if=none,id=nvm -device nvme,drive=nvm,serial=deadbeef'
```

## Detail

### 1. Image file 생성

- NVMe 를 emulation 하기 위한 raw 포맷의 블럭이 하나 필요하다.
- 해보니 대충 세가지 방법이 있는듯
1. `qemu-img` 사용하기

```bash
qemu-img create -f raw /path/to/myblock.raw 10G
```

2. `dd` 사용하기
	- 아래 명령어는 10GiB raw image 를 생성한다.
	- 기본 block 사이즈가 512byte 이므로 $10 * 1024 * 1024 * 2 * 512byte = 10GiB$ 인 것.

```bash
dd if=/dev/zero of=/path/to/myblock.raw count=$(( 10 * 1024 * 1024 * 2 ))
```

3. Proxmox UI 사용하기
	- GUI 로 해결할 수 있긴 하지만 좀 부자연스럽긴 하다.
	- `VM` -> `Hardware` -> `Add` (`Hard Disk`) 에서 Format 만 `Raw disk image (raw)` 로 설정해주고 생성한 뒤에
	- `Detach` 버튼 눌러서 `Unused Disk` 상태로 만든 뒤
	- 다음 명령어로 raw file path 만 찾아주면 된다.

```bash
find / -name '*.raw'
```

![[Pasted image 20240423093141.png]]

### 2. VM 에 NVMe device parameter 주입하기

- [공식문서](https://qemu-project.gitlab.io/qemu/system/devices/nvme.html) 에 parameter guide 를 참고해서 VM args 에 넣어주면 된다.
- 가장 간단하게는 다음의 parameter 를 넣어주면 됨.

```bash
-drive format=raw,file=/path/to/myblock.raw,if=none,id=nvm
-device nvme,drive=nvm,serial=deadbeef
```

- 근데 이걸 어떻게 이미 생성된 VM 에 넣어주느냐.
- VM arg 에 추가하는 방법은 아래처럼 cli 로 하거나

```bash
qm set ${VMID} --args '-drive format=raw,file=/path/to/myblock.raw,if=none,id=nvm -device nvme,drive=nvm,serial=deadbeef'
```

- VM 설정 파일을 직접 수정해 줘도 된다.

```bash
vim /etc/pve/qemu-server/${VMID}.conf
```

```
args: -drive format=raw,file=/path/to/myblock.raw,if=none,id=nvm -device nvme,drive=nvm,serial=deadbeef
...뭐 나머지 설정들...
```

## Journal

- 처음에 [공식문서](https://qemu-project.gitlab.io/qemu/system/devices/nvme.html) 를 봤을 때 parameter guide 만 나오고 어떤 명령어에 이것을 주입해주는지 설명이 (물론 어딘가에는 되어있었겠지만) 없어서 한참 찾아다녔다.
- 결국에는 `qemu-system-x86_64` 명령어에 넣어주는 것이라는 것을 알았으나 이 명령어를 사용하면 새로 nvme device 를 emulate 해서 vnc server 를 열어주는 것이 아닌가.

![[Pasted image 20240423093703.png]]

- 근데 이미 생성한 VM 에 nvme device 를 붙여주고 싶었기 때문에 또 이것저것 들쑤시다가
- 아래 블로그들에서 `virt-manager` 를 사용했을 때의 가이드를 보고 VM 에 arg 로 주입하면 된다는 힌트를 얻었다.
	- [Frankenmichl's random linux and other 블로그](https://blog.frankenmichl.de/2018/02/13/add-nvme-device-to-vm/)
	- [Just another Linux geek 블로그](https://blog.christophersmart.com/2019/12/18/kvm-guests-with-emulated-ssd-and-nvme-drives/)
- 그래서 Proxmox 에서는 어떻게 arg 들을 주입하나 찾아보다 보니
	- [Proxmox conf 에 arg 주입하는 법](https://forum.proxmox.com/threads/additional-command-line-parameters-to-kvm.52812/)
	- [qm set 명령어로도 가능하다.](https://pve.proxmox.com/pve-docs/qm.1.html)
	- [GUI 로는 안된다고 한다.](https://forum.proxmox.com/threads/qm-args-in-gui.89553/)
- 결과적으로는 해피엔딩이라고 한다.