---
tags:
  - mdg
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

- wg-easy 의 `docker-compose.yml` 은 이걸 사용하면 된다 ([wg-easy 설치 참고](https://blog.rhchoi.com/wireguard-seolci/)).
	- wg-easy 버전 15부터 password 를 `PASSWORD_HASH` env 로 낑가넣어야 한다.
		- 이건 사용할 비밀번호를 bcrypt 로 hash 해서 넣어주면 되는데, 이건 [이 가이드](https://github.com/wg-easy/wg-easy/blob/v14/How_to_generate_an_bcrypt_hash.md) 를 참고하자.
	- `WG_DEFAULT_ADDRESS` 에 적힌 규칙대로 wg session IP 가 할당된다.
		- 가령 아래의 `10.8.0.10x` 라고 하면 `10.8.0.100`, `10.8.0.101` ... 이런식으로 할당된다.
	- `WG_DEFAULT_DNS` 는 wireguard 가 설치된 장소의 네트워크 환경에서의 dns 주소를 적으면 된다.
		- 가령 아래의 `147.46.80.1` 는 서울대학교의 dns 주소이다.
	- `WG_ALLOWED_IPS` 는 접근이 허용된 IP 범위이다.
		- [[PVE - Simple SDN 설정하기|Simple SDN 설정하기 가이드]] 에서 설정한 [[Classless Inter-Domain Routing, CIDR (Network)|CIDR]] 이 `10.0.0.0/24` 이기 때문에 이렇게 해줬음.
		- 모든 IP 를 허용하려면 `0.0.0.0/0` 로 하면 된다.

```yaml
version: "3.8"
volumes:
  etc_wireguard:

services:
  wg-easy:
    environment:
      # Change Language:
      # (Supports: en, ua, ru, tr, no, pl, fr, de, ca, es, ko, vi, nl, is, pt, chs, cht, it, th, hi)
      - LANG=en
      # ⚠️ Required:
      # Change this to your host's public address
      - WG_HOST= # 사용할 public IP 혹은 도메인

      # Optional:
      - PASSWORD_HASH= # bcrypt-hashed password
      # - PORT=51821
      # - WG_PORT=51820
      - WG_DEFAULT_ADDRESS=10.8.0.10x
      - WG_DEFAULT_DNS=147.46.80.1
      # - WG_MTU=1420
      - WG_ALLOWED_IPS=10.0.0.0/24
      # - WG_PERSISTENT_KEEPALIVE=25
      # - WG_PRE_UP=echo "Pre Up" > /etc/wireguard/pre-up.txt
      # - WG_POST_UP=echo "Post Up" > /etc/wireguard/post-up.txt
      # - WG_PRE_DOWN=echo "Pre Down" > /etc/wireguard/pre-down.txt
      # - WG_POST_DOWN=echo "Post Down" > /etc/wireguard/post-down.txt
      - UI_TRAFFIC_STATS=true
      - UI_CHART_TYPE=1 # (0 Charts disabled, 1 # Line chart, 2 # Area chart, 3 # Bar chart)

    image: ghcr.io/wg-easy/wg-easy
    container_name: wg-easy
    volumes:
      - etc_wireguard:/etc/wireguard
    ports:
      - "51820:51820/udp"
      - "51821:51821/tcp"
    restart: unless-stopped
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
    sysctls:
      - net.ipv4.ip_forward=1
      - net.ipv4.conf.all.src_valid_mark=1
```

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