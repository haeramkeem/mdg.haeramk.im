---
tags:
  - qemu
  - guides
date: 2025-06-18
---
> [!info]- 참고한 것들
> - [어떤 블로그](https://stevescargall.com/blog/2024/12/a-step-by-step-guide-on-using-cloud-images-with-qemu-9-on-ubuntu-24.04/)
> - [스댕 - QEMU 강제종료](https://superuser.com/a/1211516)

## TL;DR

> [!tip]- QEMU 설치
> ```bash
> sudo apt-get update
> sudo apt-get install -y qemu-system-x86 cloud-image-utils
> ```

### Cloud Image 다운로드

1. 원하는 Cloud image 를 다운로드한다.
	- 우분투는 [여기](https://cloud-images.ubuntu.com/) 에서 이미지들을 확인할 수 있고, 여기서 `-cloudimg-amd64.img` 로 이름붙은 놈을 다운로드 하면 된다.
	- 아래 예시는 Ubuntu 24.04 (`noble`) 이미지를 다운로드하는 명령어이다.

```bash
curl -L https://cloud-images.ubuntu.com/noble/current/noble-server-cloudimg-amd64.img -o vm.img
```

2. 이놈을 그냥 사용하면 root directory size 가 2GB 정도밖에 안된다. 따라서 아래 명령어로 size 를 늘려준다.
	- 아래 예시에서 128GB 를 원하는 크기로 바꿔주면 된다.

```bash
qemu-img resize vm.img +128G
```

### Cloud Init 설정

1. [[ssh - Keypair 생성하기|ssh key]] 를 무조건 해줘야되는건 아니지만, [[index|주인장]] 은 이게 편하기 때문에 해줄거다.

```bash
ssh-keygen -C "" -N "" -f ./vm-key
```

2. 그다음에 cloud init user data 를 작성해준다.

```bash
cat <<EOF > user-data.yaml
#cloud-config
ssh_pwauth: True
chpasswd:
  expire: false
  users:
  - {name: ubuntu, password: {{ 원하는 비밀번호 입력 }}, type: text}
users:
  - name: ubuntu
    groups: users, sudo
    shell: /usr/bin/bash
    ssh_authorized_keys:
      - `cat vm-key.pub`
EOF
```

3. 그리고 cloud init metadata 도 작성해 준다.

```bash
cat << EOF > meta-data.yaml
instance-id: `uuidgen`
local-hostname: {{ 원하는 hostname 입력 }}
EOF
```

4. 마지막으로 이것들을 가지고 cloud init seed image 를 만든다.

```bash
cloud-localds vm-seed.img user-data.yaml meta-data.yaml
```

### QEMU VM 실행

- 요래 하면 된다:

```bash
sudo qemu-system-x86_64 \
-cpu host \
-machine type=q35,accel=kvm \
-smp {{ Core 수 }} \
-m {{ Memory 사이즈 }}G \
-nographic \
-netdev id=net00,type=user,hostfwd=tcp::{{ 사용할 SSH port }}-:22 \
-device virtio-net-pci,netdev=net00 \
-drive if=virtio,format=qcow2,file=vm.img \
-drive if=virtio,format=raw,file=vm-seed.img
```

- 그리고 이놈에 ssh 로 접근할 때는 요래 하면 된다:

```bash
ssh -i vm-key -p {{ 사용할 SSH port }} ubuntu@localhost
```

### QEMU 강제종료

- QEMU VM 을 강제종료할 때는, 아래처럼 하면 된다:
	1) `Ctrl + a` 를 누른다.
	2) 키를 떼고,
	3) `x` 를 누른다.
- 여기서 조심할 것은 `x` 를 누를 때는 `Ctrl + a` 가 눌려있으면 안된다는 것이다.