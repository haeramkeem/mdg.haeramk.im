---
tags:
  - shellscript
  - bash-nvidia
date: 2025-05-22
---
> [!info]- 참고한 것들
> - [티스토리 블로그 - ubuntu-drivers 설치](https://nirsa.tistory.com/331)
> - [Canonical 공홈](https://documentation.ubuntu.com/server/how-to/graphics/install-nvidia-drivers/index.html)
> - [CUDA 최신버전](https://developer.nvidia.com/cuda-downloads)
> - [CUDA 11.8](https://developer.nvidia.com/cuda-11-8-0-download-archive)

> [!info] Server 기준 설명입니다.
> - 주인장은 Ubuntu Desktop 버전을 사용하지 않기 때문.

## TL;DR

> [!tip] CUDA 버전
> - CUDA 버전이 꼬이면 진짜 개귀찮다. 우선 사용하고자 하는 PyTorch 등의 버전을 확인해서 어떤 CUDA 버전을 설치해야할지 정하자.

- 우선 keyring 을 다운받는다.
	- 여기서 `ubuntu2204` 와 `x86_64` 는 만약 다른 버전의 ubuntu 혹은 arch 를 사용중이라면, [이거](https://docs.nvidia.com/datacenter/tesla/driver-installation-guide/index.html#system-requirements) 를 참고해서 그에 맞게 바꿔주자.

```bash
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb
```

- 그리고 이 keyring 을 설치하고, apt update 를 해준다.

```bash
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt-get update
```

- 아래 명령어로 어떤 버전이 있는지 확인하고,

```bash
sudo apt-cache madison cuda
```

- 해당 버전에 맞게 설치해주자. 그럼 CUDA 뿐 아니라 driver 도 같이 설치된다.

```bash
sudo apt-get install -y cuda=버전
```

## 추가적인 방법: Ubuntu Repository

- 공홈에서는 `ubuntu-drivers` 를 사용하여 driver 를 설치하라고 하는데, 주인장은 머리털 자란 이후로 이게 기본적으로 설치되어있는 것을 본 적이 없다.

```bash
sudo apt-get install -y ubuntu-drivers-common
```

- 그리고 이래 하면 `ubuntu-drivers` 로 driver 를 설치할 수 있다.

```bash
sudo ubuntu-drivers autoinstall
```

### 특정 버전 설치

- 이래 하면 `ubuntu-drivers` 로 설치할 수 있는 driver 의 목록이 보인다.

```bash
sudo ubuntu-drivers list --gpgpu
```

- 여기있는 것들 중에 `숫자-server` 라고 붙은 것을 아래 명령어로 설치하믄 된다.

```bash
sudo ubuntu-drivers install --gpgpu nvidia:숫자-server
```