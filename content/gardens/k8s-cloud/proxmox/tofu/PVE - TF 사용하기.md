---
tags:
  - mdg
  - "\bk8s-cloud"
  - proxmox
  - tofu
date: 2026-07-25
---
## 개요

- 원래는 PVE 에는 terraform 따위 없는줄 알았다.
- 근데 찾아보니까 꽤 괜찮은게 있더라. 그래서 편한 terraform 을 쓰기로 했다.

## 조건

- Terraform 은 자본주의의 노예가 되었다. 그래서 [OpenTofu](https://opentofu.org/) 로 진행.
- PVE provider 는 [bpg](https://github.com/bpg/terraform-provider-proxmox) 가 괜찮아보인다.

## 가이드

> [!tip] 명령어 어디서 실행?
> - 별도 명시가 없으면 전부 PVE 내에서 실행하는거다.

### PVE 계정 만들기

- 우선 PVE 계정을 하나 만든다.
	- `@pve` 는 약간 [[ServiceAccount (Kubernetes)|ServiceAccount]] 같은거다. 반대로 `@pam` 자연인 사용자 계정이라고 생각하면 된다.

```bash
pveum user add {{USER}}@pve
```

- 이놈에게 Admin 권한을 준다.
	- 물론 이건 보안상 위험할 수 있다. 알아서 판단하시길.

```bash
pveum aclmod / -user {{USER}}@pve -role PVEAdmin
```

- 그리고 Token 을 만들어준다.

```bash
pveum user token add {{USER}}@pve {{TOKEN}} --privsep 0
```

- 그럼 아래와 같은 표가 하나 뜨게 된다.

```
┌──────────────┬──────────────────────────────────────┐
│ key          │ value                                │
╞══════════════╪══════════════════════════════════════╡
│ full-tokenid │ {{USER}}@pve!{{TOKEN}}               │
├──────────────┼──────────────────────────────────────┤
│ info         │ {"privsep":"0"}                      │
├──────────────┼──────────────────────────────────────┤
│ value        │ UUID                                 │
└──────────────┴──────────────────────────────────────┘
```

- 저 `value` 가 중요하다. 이 값을 어디 잘 저장해두고, 아래처럼 환경변수로 빼둔다.

```bash
export PROXMOX_VE_API_TOKEN="{{USER}}@pve!{{TOKEN}}={{UUID}}"
```

### Linux 계정 만들기

- 그리고 PVE 의 Linux 에도 tofu 가 사용할 계정을 하나 만들어주자.
	- PVE 계정뿐 아니라 Linux 계정도 만드는 이유는 PVE Provider 가 API 만으로는 모든 작업을 할 수 없기 때문에 종종 `ssh` 를 사용하기 때문이다.

```bash
useradd -m -s /bin/bash {{USER}}
```

- 그리고 이놈에 대한 권한을 줘야 한다.
	- PVE Linux 에는 `sudo` 가 깔려있지 않기 때문에 깔아줘야 한다.

```bash
apt update
apt install sudo
visudo -f /etc/sudoers.d/{{USER}}
```

- `visudo` 를 하면 Nano 가 뜬다. 이름이 `"vi" sudo` 인데 도대체 왜?
	- 어쨋든 열어서 아래 내용을 저장해준다.

```
{{USER}} ALL=(root) NOPASSWD: /usr/sbin/pvesm
{{USER}} ALL=(root) NOPASSWD: /usr/sbin/qm
{{USER}} ALL=(root) NOPASSWD: /usr/bin/tee /var/lib/vz/snippets/[a-zA-Z0-9_][a-zA-Z0-9_.-]*
```

- 그리고 이놈에 `ssh` 로 접근하기 위한 key 도 만든다.
	- 우선 [[ssh - Keypair 생성하기|ssh keypair 생성 가이드]] 로 key 를 만들어준다.
	- 그리고 [[ssh - Remote 에 Keypair 추가하기|이 가이드]] 를 사용해서 key 를 넘겨주고싶은데 아쉽게도 우리가 지금 만든 계정은 password 가 없어서 password 인증방식이 안된다.
	- 그래서 그냥 PVE 내부에 직접 복붙해야 한다.

```bash
mkdir -p /home/{{USER}}/.ssh
echo '{{Public key 내용}}' > /home/{{USER}}/.ssh/authorized_keys
chown -R {{USER}}:{{USER}} /home/{{USER}}/.ssh
chmod 700 /home/{{USER}}/.ssh
chmod 600 /home/{{USER}}/.ssh/authorized_keys
```

- 마지막으로 client 에도 ssh key 를 넣어줘야 한다.
	- 이건 PVE 안에서가 아니고 client 에서 하는거다.
	- 이걸 왜하냐면 PVE Provider 는 ssh 접속정보를 모르기 때문에 그걸 그냥 client 의 ssh agent 에게 위임하기 때문이다. 근데 ssh agent 는 이렇게 `ssh-add` 로 등록된 key 들을 가지고 인증 시도를 하기 때문에 넣어줘야 하는 것.

```bash
ssh-add /path/to/pub
```

### TF 파일 만들기

- 그리고 이렇게 `.tf` 파일을 작성한 뒤 `tofu init` 하면 준비가 된 것이다.

```tf
terraform {
  required_version = ">= 1.6"

  required_providers {
    proxmox = {
      source  = "bpg/proxmox"
      version = "~> 0.110"
    }
  }
}

provider "proxmox" {
  endpoint  = "https://{{주소}}:8006/"
  
  ssh {
    agent = true
    username = "{{USER}}"
  }
}
```

## Import 하기

- 이미 돌고 있는 PVE 에서 resource 들을 import 해야 되는데, 이건 약간 왕도가 없다.
- 그냥 채찍피티에게 물어보면서 맞춰가야 한다. 뭐 정형화된 방법은 못찾겠음.

## 참고

- 만약 Token 을 잘못 만들었으면 이렇게 지우면 된다.

```bash
pveum user token remove {{USER}}@pve {{TOKEN}}
```

- 발급된 Token 이 뭐가 있는지 확인하고싶으면 이렇게 하면 된다.

```bash
pveum user token list {{USER}}@pve
```