---
tags:
  - mdg
  - shellscript
  - bash-docker
  - docker
date: 2024-08-30
---
> [!info]- 참고한 것들
> - [공식 홈페이지](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository)

## Containerd (+ Docker) 설치하기

- Prerequisites 설치

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl
```

- Docker GPG 키 추가

```bash
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

- APT repo 추가

```bash
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
```

- 설치

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo apt-mark hold docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker containerd
```

- 만약 containerd 만 설치할거라면:

```bash
sudo apt-get install containerd.io
sudo apt-mark hold containerd.io
sudo systemctl enable --now containerd
```

## 확인

- Docker

```bash
sudo systemctl status docker
```

- Containerd

```bash
sudo systemctl status containerd
```

## Docker `sudo` 없이

- `sudo` 없이 docker 를 사용하려면 이렇게 하면 된다.

```bash
sudo usermod -aG docker $USER
```

- 그 다음 shell 을 닫고 다시 로그인해주면 적용된다.