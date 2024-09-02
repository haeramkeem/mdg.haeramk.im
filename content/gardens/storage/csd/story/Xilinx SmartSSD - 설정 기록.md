---
tags:
  - storage
  - storage-csd
  - story
date: 2024-08-29
---
## 삽질 기록

- QEMU 에 `vfio-pci` 로 csd 를 연결해주려고 했는데 잘 안됐다..
	- 모든 PCI device 가 `vfio-pci` 가 되는게 아닌가봄
	- NVMe (`144d:a825`) 랑 Processing accelerator (`10ee:6987`, `10ee:6988`) 는 `vfio-pci` 로 드라이버가 잡히는데 PCI bridge (`10ee:9134`, `10ee:9234`, `10ee:9434`) 는 도저히 안된다.
- 결국에는 서버를 밀고 Ubuntu 20.04 를 설치했는데, 네트워크 드라이버가 안잡힌다.
	- [해결](https://physical-world.tistory.com/56)
- 그 다음에는 [가이드](https://docs.amd.com/v/u/en-US/ug1382-smartssd-csd) 에 나온대로 XRT, development, deployment kit 을 설치하면 된다.
- Device 가 잘 잡히는지 확인:

```bash
sudo /opt/xilinx/xrt/bin/xbmgmt examine --report platform
```

![[Pasted image 20240829193651.png]]

- 다음에는 펌웨어 포팅하기:
	- 여기서 `${BDF}` 는 PCI code + function (`0000:04:00.1` 등) 이다.
	- 다만 이미 최신 버전이어서 할게 없었음

```bash
sudo /opt/xilinx/xrt/bin/xbmgmt program --base --device ${BDF}
```

![[Pasted image 20240829194538.png]]

- 그리고 `xbutil` 의 `validate` 명령어로 몇가지 테스트를 해본다.

```bash
sudo /opt/xilinx/xrt/bin/xbutil validate --device ${BDF}
```

![[Pasted image 20240829193634.png]]

