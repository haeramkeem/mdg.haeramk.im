---
tags:
  - 삽질록
  - Proxmox
date: 2024-08-13
---
> [!info]- 참고한 것들
> - 

> [!info]- 넋두리
> - 종종 구글링하다 보면 대학원생이 쓴 것 같은 설정기들이 종종 보이는데
> - 옛날에는 사람들이 이런걸 왜 적나 했다: 현업 엔지니어도 아닌 사람이 끄적여 놓은 글 볼바에는 공식 문서나 적어도 회사 테크블로그를 (개인적으로는 더 신뢰하기 때문에) 보기 때문.
> - 하지만 막상 주인장도 대학원생이 되니 이런 글 적고 있다. 그냥 개인 기록용이니 usecase 정도로만 생각하고 신뢰하지는 말자.

> [!info]- 전체 스토리
> - [[Proxmox 01 - Basic Setup Journal]]
> - [[Proxmox 02 - NVMe Emulation (ZNS, FDP)]]
> - [[Proxmox 03 - NVMe Emulation for VM]]

## 배경

- 원래는 안하려 했다.
- 하지만 서버를 증설할 필요가 있었고, 이놈에 PVE 를 깔아서 PCI passthrough 로 원하는 SSD 를 VM 에 직접 붙여 개발환경을 구성하고싶어서
- 결국에 남는 iptime 공유기로 NAT 환경을 구성해야만 했다.

## Router config

### 0. WAN config

- 서울대학교는 MAC 주소를 전달하고 IP 를 받아와 static IP 를 설정해야 한다.
- 따라서 iptime 의 `Basic Setup` -> `Internet Setup` 에서 static IP 를 설정해 준다.
	- GW 는 `/24` 에 `.1` 로 설정하고
	- DNS 는 (아마도 내부 DNS 인) `147.46.80.1` 로 설정한다.

### 1. DHCP static lease

- LAN node 에 static ip 를 할당하는 것을 netplan config 을 변경하는 방법보다는
- Router 에 DHCP static lease 를 설정해놓아 node 에다가는 그냥 `dhcp: true` 으로 박아놓으면 편하기 때문에 그렇게 했다.
- 방법은 `Advanced Setup` -> `Network` -> `DHCP Server Setup` 에서 아래부분에 `Manual address` 에 원하는 노드의 IP:MAC 을 저장해 주었다.

### 2. Port-forward

- PVE UI 와 WireGuard 용 port-forward 를 뚫어주었는데
- 방법은 그냥 `Advanced Setup` -> `NAT/Routing` -> `Port Forwarding` 으로 설정해 주면 된다.

### 3. Config save

![[Pasted image 20240814124839.png]]

- 우측상단에 저 연두색 버튼을 눌러 설정을 저장해야 한다.
- 주인장은 이거 안했더니 port-forward 가 안돼서 원인파악한다고 시간 꽤 날렸다.

## PVE new node setup

- 그렇게 하고 PVE 를 새 node 에 설치해 준 뒤 (1) cluster 합류, (2) SDN 설정을 했는데 새 node 에서 인터넷이 안된다.

### NIC setup

- 우선은 `journalctl -xeu networking` 으로 보니까 NIC 을 찾을 수 없다고 한다.
	- 그래서 보니까 `/etc/network/interfaces` 에 NIC 이름이 잘못 기입돼어 있었다.
	- 근데 이건 내잘못은 아님; 저 파일은 자동생성되는 놈이다.

### SDN setup

- 그리고 SDN 이 설정이 잘 안되고 다음과 같은 문구가 떠있었다.

```
local sdn network configuration is not yet generated, please reload
```

- 이건 보니까 SDN 에 `apply` 버튼을 눌러야 되더라. ([참고](https://forum.proxmox.com/threads/sdn-doesnt-replicate-in-cluster.140807/))

### NoVNC error

- VM 에 VNC 로 붙어보려고 하니까 이런 에러가 났다:

```
NoVNC error: Host Key verification failed (TASK ERROR: Failed to run vncproxy.)
```

- 이건 SSH host key verification 때문이다. 다음의 명령어를 node 에서 실행해 주면 잘 된다. ([참고](https://forum.proxmox.com/threads/console-failed-to-connect-to-server-host-key-verification-failed.78957/))

```
ssh -e none -o 'HostKeyAlias=server-b-name' root@server-b-ip-address /bin/true
```

## Failed..

- 위 과정을 하니까 되긴 한다. 근데 (1) VM 에서 DHCP 가 안되고 (2) WireGuard 로 새로 추가한 node 의 VM 에 접근이 안된다.
- 보니까
	1. SDN 이 Simple mode 이다. Multi-node VM 간 통신을 위해서는 Simple 이 아니고 VLAN 이나 VXLAN 이어야 한다.
	2. 근데 DHCP 는 지금까지는 Simple 에서만 가능하다고 한다. ([참조](https://forum.proxmox.com/threads/dhcp-with-vxlan-in-pve-8-1-3.137928/))
- 그래서 그냥 때려침; DHCP 가 안되는건 뭐 static ip 로 불편을 감수하고 할 수 있겠지만 WireGuard 가 안되는건 좀 문제가 있다.
- 결국에는 [[Kubernetes 설치 가이드|Kubernetes]] 를 사용하기로.