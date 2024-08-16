---
tags:
  - Proxmox
date: 2024-04-22
---
> [!info]- 참고한 것들
> - [공식 문서](https://pve.proxmox.com/wiki/Setup_Simple_Zone_With_SNAT_and_DHCP)

## VPC (SDN) 설정

- 다만 Proxmox 에서 virtual network 를 설정하고 port-forwarding 등을 하는 것은 대부분 가이드에서 iptable 을 직접 만지는 것으로 소개한다. 하지만
	- 많은 가이드에서 소개하는 `/etc/network/interface` 파일을 만져서 bridge 를 생성해주면 왜인지는 모르겠지만 GUI 상에서 안보였다.
	- 그리고 이렇게 직접 iptable 만져서 네트워크 구성할 거면 HCI 를 쓸 이유가 없다고 생각한다.
		- 이럴거면 그냥 linux distro 깐 다음에 vagrant 같은걸로 provisioning 하지 안그래?
		- 따라서 최대한 GUI 로 해결하고 도저히 안되는 것만 cli 로 하기로 했당.

### 결정된 설정

- `Simple` zone type
- DHCP enabled
- Subnet: `10.0.0.1/24` (DHCP: `10.0.0.100` ~ `10.0.0.255`)

### DHCP

- DHCP 를 사용하기 위해서는 `dnsmasq` 를 설치하고 기존의 그것은 비활시켜야 한다고 한다. ([출처](https://pve.proxmox.com/pve-docs/chapter-pvesdn.html#pvesdn_install_dhcp_ipam))

```bash
apt update
apt install -y dnsmasq
systemctl disable --now dnsmasq
```

### 설정 과정

1. `Datacenter` -> `SDN`/`Zones` 에서 `Simple` type 으로 생성
	- 이때 `automatic DHCP` 꼭 선택하기
2. `SDN`/`VNets` 에서 위에서 만든 zone 명시해서 생성
	- `Tag` 나 `VLAN Aware` 은 안해도 된다.
3. 생성한 VNet 선택한 뒤에 그 옆의 `Subnet` 섹션에서 생성해 준다.
	- `General` 과 `DHCP Ranges` 를 알아서 잘 채워주면 되는데
	- `General` 에서 SNAT 체크해 주자.
4. `SDN` 누르면 위에 `Apply` 버튼이 있다. 이거 꼭 눌러주자.