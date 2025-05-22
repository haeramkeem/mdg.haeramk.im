---
tags:
  - terraform
  - guides
date: 2025-05-22
---
> [!info] 이 글의 목적
> - 이 글은 제대로 terraform 및 클라우드를 파보는 글이 아닌, 전직 클라우드 엔지니어가 적는 "아닌 밤중에 갑자기 GCE 하나가 필요할 때 얼른 만들어서 사용하기 위한 가이드" 입니다.

## TL;DR

- 우선 `gcloud` 로 로그인해준다.

```bash
gcloud auth login
gcloud config set project your_project_id
gcloud auth application-default login
gcloud services enable compute.googleapis.com
```

- 그 다음에 이걸 사용하면 된다.

```terraform title="main.tf" {2-4,18-19,23,35}
provider "google" {
  project = "your_project_id"
  region  = "asia-northeast3"
  zone    = "asia-northeast3-a"
}

resource "google_compute_network" "default" {
  name                    = "vm-network"
  auto_create_subnetworks = true
}

resource "google_compute_address" "ssh_ip" {
  name = "vm-ssh-ip"
}

resource "google_compute_instance" "vm_instance" {
  name         = "vm-instance"
  machine_type = "g2-standard-4"
  zone         = "asia-northeast3-a"

  boot_disk {
    initialize_params {
      image = "projects/ubuntu-os-cloud/global/images/family/ubuntu-2204-lts"
    }
  }

  network_interface {
    network       = google_compute_network.default.name
    access_config {
      nat_ip = google_compute_address.ssh_ip.address
    }
  }

  metadata = {
    ssh-keys = "ubuntu:${file("/path/to/key.pub")}"
  }

  service_account {
    scopes = ["https://www.googleapis.com/auth/cloud-platform"]
  }

  scheduling {
    on_host_maintenance = "TERMINATE"
    automatic_restart    = false
  }

  tags = ["ssh"]
}

output "ssh_ip" {
  value = google_compute_address.ssh_ip.address
}
```

- 몇가지 바꿀만한 것을 보면
	- 2번째 줄의 `project`: 사용하고자 하는 project 의 id 를 적어주면 된다.
	- 3번째 줄의 `region`: 지금은 서울 (`asia-northeast3`) 로 되어 있고, 다른곳을 사용하고 싶으면 바꿔주면 된다.
	- 4, 19번째 줄의 `zone`: 사용할 availability zone. 필요하면 바꿔주자.
	- 18번째 줄의 `machine_type`: 사용할 instance type. 지금은 GPU 가 달린 `g2-standard-4` 이다.
	- 23번째 줄의 `image`: 사용할 OS image. 지금은 Ubuntu 22.04 이다.
	- 35번째 줄의 `ssh-keys`: SSH key path.
- Resouce 생성:

```bash
terraform init
terraform apply
```

- SSH 접속:

```sh
ssh -i /path/to/private_key ubuntu@$(terraform output -raw instance_ssh_ip)
```