---
tags:
  - mdg
  - k8s-cloud
  - proxmox
  - tofu
date: 2026-07-27
aliases:
  - TF 로 Cloud Image VM 만들기
---
## 개요

- [[PVE - VM 생성|이짓]] 그만하고 Cloud Image 를 사용해보자.

## 1. Cloud Image TF

### 1-1. PVE Role 추가

- Cloud Image 를 PVE Provider 가 다운로드 하게 하려면 `PVEAdmin` 으로는 안된다.
- 우선 `Sys.Modify` 가 달린 role 을 하나 만들고,

```bash
pveum role add {{Role 이름}} -privs "Sys.Modify"
```

- [[PVE - TF 사용하기|여기]] 에서 생성한 계정에 달아주면 된다.

```bash
pveum aclmod / -user {{USER}}@pve -role {{Role 이름}}
```

### 1-2. TF 작성

- 그리고 이렇게 해주면 달콤하게 다운로드된다.
	- 여기서 주의할 것은:
		- `content_type = "import"` 이어야 한다는 점
		- File 이기 때문에 `datastore_id = "local"` 이어야 한다는 점
		- `.qcow2` 확장자로 `file_name = "{{파일 이름}}.qcow2"` 을 지어줘야한다는 점이다.

```tf
resource "proxmox_download_file" "{{Resource 이름}}" {
  content_type = "import"
  datastore_id = "local"
  node_name    = "{{Node 이름}}"
  url          = "{{URL}}"
  file_name    = "{{파일 이름}}.qcow2"
}
```

- 아래 예시는 Ubuntu 24.04 Noble 을 다운로드 하는 resource 다.

```tf
resource "proxmox_download_file" "cloudimg_ubuntu_2404" {
  content_type = "import"
  datastore_id = "local"
  node_name    = "{{Node 이름}}"
  url          = "https://cloud-images.ubuntu.com/noble/current/noble-server-cloudimg-amd64.img"
  file_name    = "noble-server-cloudimg-amd64.qcow2"
}
```

## 2. Vendor Data TF

- 문제는 저 Cloud image 안에는 QEMU agent 가 설치되어있지 않다는 것이다.
	- 이게 설정이 안돼있으면 VM 에게 IP 가 할당이 안된다.
- 그래서 Cloud init 으로 QEMU agent 를 깔아줘야 한다.
- 여기서 포인트는:
	- Cloud init 의 user data 는 PVE provider 가 resource definition 을 보고 알아서 조립한다.
	- 그래서 우리가 원하는 것을 추가로 넣어주려면, user data 가 아니라 vendor data 로 넣어야 한다.
	- Cloud init 은 이 user data 와 vendor data 를 합쳐서 VM 초기화를 한다고 한다.
- 그래서 이 vendor data 용 resource 를 하나 만들어야 한다:
	- 뭐 여기서 mustache 로 된 부분 외에는 따로 건들건 없다.

```tf
resource "proxmox_virtual_environment_file" "{{Resource 이름}}" {
  content_type = "snippets"
  datastore_id = "local"
  node_name    = "{{Node 이름}}"

  source_raw {
    file_name = "qemu-agent-vendor-data.yaml"
    data      = <<-EOF
      #cloud-config
      packages:
        - qemu-guest-agent
      runcmd:
        - systemctl enable --now qemu-guest-agent
    EOF
  }
}
```

### 2-1 No such file or directory 에러

- 만약 위처럼 했는데 `No such file or directory` 에러가 난다면 snippets 디렉토리가 없는거다.
	- 즉, `local` data store 에 snippets type 이 등록되지 않은 거다.
- 이건 이렇게 하면 해결된다:

```bash
pvesm set local --content iso,import,backup,vztmpl,snippets
```

## VM TF

- 마지막으로 이래 해주면 VM 이 생성된다.

```tf
resource "proxmox_virtual_environment_vm" "{{Resource 이름}}" {
  name      = "{{VM 이름}}"
  node_name = "{{Node 이름}}"

  agent {
    enabled = true
  }

  stop_on_destroy = true

  cpu {
    cores = {{Core 수}}
    type  = "x86-64-v2-AES"
  }

  memory {
    dedicated = {{Memory 사이즈: MiB 단위}}
  }

  disk {
    datastore_id = "local-lvm"
    import_from  = proxmox_download_file.{{Cloud image resource 이름}}.id
    interface    = "scsi0"
    size         = {{Disk 사이즈: GiB 단위}}
  }

  network_device {
    bridge = "main"
  }

  initialization {
    vendor_data_file_id = proxmox_virtual_environment_file.{{Vendor data resource 이름}}.id

    ip_config {
      ipv4 {
        address = "dhcp"
      }
    }

    user_account {
      keys     = [trimspace(file("{{SSH public key 경로}}"))]
      username = "ubuntu"
    }
  }

  operating_system {
    type = "l26"
  }
}
```

- 만약 static IP 를 원한다면, `initialization` 블럭을 이렇게 하면 된다.

```tf
initialization {
  # 나머지 동일

  ip_config {
    ipv4 {
	  address = "{{Static IP 주소}}/24"
	  gateway = "{{Gateway 주소}}"
    }
  }

  dns {
    servers = ["{{DNS 주소}}"]
  }

  # 나머지 동일
}
```