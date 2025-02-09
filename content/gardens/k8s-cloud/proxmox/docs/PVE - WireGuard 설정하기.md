---
tags:
  - proxmox
date: 2024-04-22
---
> [!info]- 참고한 것들
> - [Alpine lxc 생성](https://svrforum.com/os/282701)
> - [Alpine 에 docker 설치](https://wiki.alpinelinux.org/wiki/Docker)
> - [wg-easy 설치 참고](https://blog.rhchoi.com/wireguard-seolci/)
> - [wg-easy github](https://github.com/wg-easy/wg-easy)
> - [Port-forward 설정 참고](https://wiki.abyssproject.net/en/proxmox/proxmox-with-one-public-ip)

## VPN (WireGuard) 설정

### Docker 설정 어떻게?

- WireGuard + Web UI 를 지원하는 [wg-easy](https://github.com/wg-easy/wg-easy) 를 docker 에 올려 사용할 생각을 했다.
- Host docker + wg
	- 안됨 - 뭔가 iptables rule 이 꼬이는건지 docker 설치시에 vm 에서 인터넷이 안된다.
- LXC docker + wg
	- LXC 에 docker 를 깔아 wg 설정 + host 에는 port-forward 만 cli 로 수정

### 설정 과정

- [Alpine lxc 생성](https://svrforum.com/os/282701) 요약:
		1. `local` 와 같은 볼륨에서 -> `CT Templates` 선택 -> `Templates` 선택 -> 원하는 LXC 다운로드
		2. 화면 우측상단에서 `Create CT` 눌러서 생성 (여기는 뭐 어려울게 없음)
- [Alpine 에 docker 설치](https://wiki.alpinelinux.org/wiki/Docker)

```bash
apk update
apk add docker docker-cli-compose
rc-update add docker default
service docker start
```

- [wg-easy 설치 참고](https://blog.rhchoi.com/wireguard-seolci/)
- [Port-forward 설정 참고](https://wiki.abyssproject.net/en/proxmox/proxmox-with-one-public-ip)
	- 설정 결과 (`/etc/network/interfaces.d/sdn`): 아래의 것들만 추가하면 된다.

```
	# WireGuard
	post-up         iptables -t nat -A PREROUTING -i vmbr0 -p udp --dport 51820 -j DNAT --to-destination 10.0.0.2:51820
	post-down       iptables -t nat -D PREROUTING -i vmbr0 -p udp --dport 51820 -j DNAT --to-destination 10.0.0.2:51820
	post-up         iptables -t nat -A PREROUTING -i vmbr0 -p tcp --dport 51821 -j DNAT --to-destination 10.0.0.2:51821
	post-down       iptables -t nat -D PREROUTING -i vmbr0 -p tcp --dport 51821 -j DNAT --to-destination 10.0.0.2:51821
```

- 다만 SDN 에서 `Apply` 버튼을 누르면 위 항목들은 manual 하게 추가한 것이기 때문에 사라진다. 만약 SDN 설정이 바뀌어서 `Apply` 를 할 일이 있다면 위의 설정을 복붙해주자.