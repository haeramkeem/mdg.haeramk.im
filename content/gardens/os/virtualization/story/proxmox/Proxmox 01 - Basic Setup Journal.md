---
tags:
  - 삽질록
  - Proxmox
date: 2024-04-21
---
> [!info]- 넋두리
> - 종종 구글링하다 보면 대학원생이 쓴 것 같은 설정기들이 종종 보이는데
> - 옛날에는 사람들이 이런걸 왜 적나 했다: 현업 엔지니어도 아닌 사람이 끄적여 놓은 글 볼바에는 공식 문서나 적어도 회사 테크블로그를 (개인적으로는 더 신뢰하기 때문에) 보기 때문.
> - 하지만 막상 주인장도 대학원생이 되니 이런 글 적고 있다. 그냥 개인 기록용이니 usecase 정도로만 생각하고 신뢰하지는 말자.

> [!info]- 전체 스토리
> - [[Proxmox 01 - Basic Setup Journal]]
> - [[Proxmox 02 - NVMe Emulation (ZNS, FDP)]]
> - [[Proxmox 03 - NVMe Emulation for VM]]
> - [[Proxmox 04 - NAT]]

## 개요

- [[FDP on NVMeVirt (SNU CSE AOS24s Project)]] 를 위해서, 그리고 연구실 내 놀고 있는 데스크탑을 활용하기 위해 수행했던 Proxmox 작업 을 기록해 보자.

## Basic Idea

- 전직 클라우드 엔지니어로써, 그리고 설정 섞이는 것을 매우 불쾌해하는 성격때문에 데스크탑에 HCI 를 설치해 사용하기로.
	- [Harvester](https://harvesterhci.io/): PoC 후 사용하지 않기로 했다. 그 이유는:
		- 다소 무거워 보임. (Minimum CPU: `8C`, Minimum MEM: `32G`, Minimum Storage: `250G` - [출처](https://docs.harvesterhci.io/v1.3/install/requirements/))
			- 물론 이 사양이 안된다고 해서 설치가 안되진 않는다. 설치시에 경고문구 출력하고 설치가 되긴 한다.
		- VIP 를 할당해줄 수 있는 환경이 아님.
			- 물론 iptime 같은데에서 switch 를 하나 사서 private ip 대역 구성해주면 VIP 맘대로 할당할 수 있지만, 사기 귀찮아서 안했다.
			- 그래서 loopback (`127.0.0.1`) 로 VIP 주고 설치하니 되긴 한다.
		- Harvester 를 고려한 제일 큰 이유는 vm 을 cloud image (qcow2 등) 로 띄우기 위함이었는데, 생각해보니 cloud init 설정을 해줘야 로그인이 된다.
			- 물론 해줄 순 있지만 그정도까지 공수를 들이긴 싫었다.
	- [oVirt](https://www.ovirt.org/): 설치해보지는 않음 (PoC 시간 부족)
	- [Proxmox](https://www.proxmox.com/en/): 이것으로 하기로 결정. 그 이유는:
		- 이미 Proxmox 에 시간 투자를 꽤 한 상황이었고
		- Harvester 보다는 가벼워 보였고
		- 버전이 8.x 여서 충분히 안정적이었기 때문.
- 다만 Proxmox 에서 virtual network 를 설정하고 port-forwarding 등을 하는 것은 대부분 가이드에서 iptable 을 직접 만지는 것으로 소개한다. 하지만
	- 많은 가이드에서 소개하는 `/etc/network/interface` 파일을 만져서 bridge 를 생성해주면 왜인지는 모르겠지만 GUI 상에서 안보였다.
	- 그리고 이렇게 직접 iptable 만져서 네트워크 구성할 거면 HCI 를 쓸 이유가 없다고 생각한다.
		- 이럴거면 그냥 linux distro 깐 다음에 vagrant 같은걸로 provisioning 하지 안그래?
		- 따라서 최대한 GUI 로 해결하고 도저히 안되는 것만 cli 로 하기로 했당.

## Proxmox 설정 기록

### VPC 설정

- [Proxmox SDN (Software Defined Network) 설정](https://pve.proxmox.com/wiki/Setup_Simple_Zone_With_SNAT_and_DHCP)
	- Zone: `zone0`
	- VNet: `vnet0`
	- Subnet: `10.0.0.1/24` (DHCP: `10.0.0.100` ~ `10.0.0.255`)

### HDD 마운트

- 이건 뭐 별로 어려운게 없었음

### VPN (WireGuard) 설정

- Host docker + wg
	- 안됨 - 뭔가 iptables rule 이 꼬이는건지 docker 설치시에 vm 에서 인터넷이 안된다.
- LXC docker + wg
	- LXC 에 docker 를 깔아 wg 설정 + host 에는 port-forward 만 cli 로 수정
	- [Alpine lxc 생성](https://svrforum.com/os/282701)
	- [Alpine 에 docker 설치](https://wiki.alpinelinux.org/wiki/Docker)
	- [wg-easy 설치 참고](https://blog.rhchoi.com/wireguard-seolci/)
	- [wg-easy github](https://github.com/wg-easy/wg-easy)
	- [Port-forward 설정 참고](https://wiki.abyssproject.net/en/proxmox/proxmox-with-one-public-ip)
		- 설정 결과 (`/etc/network/interfaces.d/sdn`):

```
auto vnet0
iface vnet0
	# ... 어쩌고 (생략) ...
	# 이 아래가 새로 추가한 내용이다:
	post-up         iptables -t nat -A PREROUTING -i vmbr0 -p udp --dport 51820 -j DNAT --to-destination 10.0.0.2:51820
	post-down       iptables -t nat -D PREROUTING -i vmbr0 -p udp --dport 51820 -j DNAT --to-destination 10.0.0.2:51820
	post-up         iptables -t nat -A PREROUTING -i vmbr0 -p tcp --dport 51821 -j DNAT --to-destination 10.0.0.2:51821
	post-down       iptables -t nat -D PREROUTING -i vmbr0 -p tcp --dport 51821 -j DNAT --to-destination 10.0.0.2:51821
```

### VM 생성

- Cloud image 를 사용할 수 없기 때문에 갓절수 없이 깡통 VM 하나 생성해서 복사하면서 쓰기로 한다.
	- 물론 뭐 cli 로 qcow 이미지 압축해제해서 사용하는 예시들이 인터넷에 많이 있긴 하다.
- 사용환경에서는 이놈을 복사해서:
	1. Hostname 변경
		- 깡통에 있는 hostname 도 그대로 가져오기 때문에 간지나는걸로 하나 만들어서 바꿔주자.

### Cloud init 설정 + template 화

- Cloud init 생성

```bash
qm set ${VM_ID} --ide2 local-lvm:cloudinit
```

- 기본적인 NIC 하나 달아주고, dhcp 설정까지 한 후
- Cloud init drive 생성해서 달아준 뒤 User, PW, IP Config (DHCP) 설정까지 해주고
- 이것을 VM Template 으로 만들어서 clone 할 수 있게 함
- Clone 이후에는 hostname 만 변경해주면 된다.
- 참고:
	- [Cloud init + template 블로그 (1)](https://ploz.tistory.com/entry/proxmox-Cloud-init-Template%EC%9C%BC%EB%A1%9C-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0)
	- [Cloud init + template 블로그 (2)](https://ploz.tistory.com/entry/proxmox-CentOS7-Template-%EB%A7%8C%EB%93%A4%EA%B8%B0)