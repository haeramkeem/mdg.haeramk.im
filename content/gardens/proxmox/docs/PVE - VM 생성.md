---
tags:
  - proxmox
date: 2024-04-22
---
> [!info]- 참고한 것들
> - [Cloud init + template 블로그 (1)](https://ploz.tistory.com/entry/proxmox-Cloud-init-Template%EC%9C%BC%EB%A1%9C-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0)
> - [Cloud init + template 블로그 (2)](https://ploz.tistory.com/entry/proxmox-CentOS7-Template-%EB%A7%8C%EB%93%A4%EA%B8%B0)

## VM 생성

- Cloud image 를 사용할 수 없기 때문에 갓절수 없이 깡통 VM 하나 생성해서 복사하면서 쓰기로 한다.
	- 물론 뭐 cli 로 qcow 이미지 압축해제해서 사용하는 예시들이 인터넷에 많이 있긴 하다.
- 사용환경에서는 이놈을 복사해서:
	1. Hostname 변경
		- 깡통에 있는 hostname 도 그대로 가져오기 때문에 간지나는걸로 하나 만들어서 바꿔주자.

## Cloud init 설정 + template 화

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