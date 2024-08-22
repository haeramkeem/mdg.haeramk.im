---
tags:
  - proxmox
date: 2024-08-16
---
> [!info]- 참고한 것들
> - [공식 문서](https://pve.proxmox.com/wiki/Setup_Simple_Zone_With_SNAT_and_DHCP)

## Multi-node SDN 설정

- Proxmox 가 진짜 개빡치는게 SDN 이 너무 부실하다.
	- DHCP 는 8.2 기준 `Simple` 에서만 가능하다.
	- 근데 multi-node VM communication 은 `Simple` 에서는 안된다.
	- 그리고 (주인장이 또 뭘 잘못했는지 모르겠는데) VLAN 이나 VXLAN 을 사용하면 LXC 컨테이너가 생성이 안된다.
- 이 모든 문제를 해결하기 위한 방법: 노드별 `Simple` zone 을 만들고, route table 을 건드려서 통신가능하게 하자!
- 그래서 [[PVE - Simple SDN 설정하기|이 가이드]] 와 달라진 점이 있다면,
	- 각 노드는 별도의 Zone 을 가진다 (zone 설정창에서 node 를 제한할 수 있음)
	- 각 노드는 별도의 IP range 를 가진다 (node0: `10.0.0.0/24`, node1: `10.0.1.0/24` 등)
	- 그리고 각 노드의 `/etc/network/interfaces.d/sdn` 에 다음의 내용을 추가한다:
- 각 노드가 다음과 같은 IP 를 가진다고 했을 때:
	- Node-0: `external: 172.16.0.101`, `internal: 10.0.0.0/24`
	- Node-1: `external: 172.16.0.102`, `internal: 10.0.1.0/24`
- Node-0 설정 (Node-1 로 가는 route 를 설정해 준다):

```
	# Node forwarding
	post-up         ip route add 10.0.1.0/24 via 172.16.0.102
	post-down       ip route del 10.0.1.0/24 via 172.16.0.102
```

- Node-1 설정 (Node-0 로 가는 route 를 설정해 준다):

```
	# Node forwarding
	post-up         ip route add 10.0.0.0/24 via 172.16.0.101
	post-down       ip route del 10.0.0.0/24 via 172.16.0.101
```