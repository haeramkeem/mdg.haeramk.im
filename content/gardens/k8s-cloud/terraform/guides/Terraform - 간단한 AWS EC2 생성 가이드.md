---
tags:
  - terraform
  - guides
date: 2025-05-22
---
> [!info] 이 글의 목적
> - 이 글은 제대로 terraform 및 클라우드를 파보는 글이 아닌, 전직 클라우드 엔지니어가 적는 "아닌 밤중에 갑자기 EC2 하나가 필요할 때 얼른 만들어서 사용하기 위한 가이드" 입니다.

## TL;DR

- 그냥 이것을 사용하면 된다.

```terraform title="main.tf" {2,54,58-59,66}
provider "aws" {
  region = "ap-northeast-2" # Seoul
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "main" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
}

resource "aws_route_table" "main" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
}

resource "aws_route_table_association" "main" {
  subnet_id      = aws_subnet.main.id
  route_table_id = aws_route_table.main.id
}

resource "aws_security_group" "ssh" {
  name        = "allow_ssh"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_key_pair" "default" {
  key_name   = "ec2_key"
  public_key = file("/path/to/key.pub")
}

resource "aws_instance" "instance" {
  ami                         = "ami-08943a151bd468f4e" # Ubuntu 22.04
  instance_type               = "t2.micro"
  subnet_id                   = aws_subnet.main.id
  vpc_security_group_ids      = [aws_security_group.ssh.id]
  key_name                    = aws_key_pair.default.key_name
  associate_public_ip_address = true

  root_block_device {
    volume_size = 100
    volume_type = "gp3"
  }

  tags = {
    Name = "Instance"
  }
}

resource "aws_eip" "ssh_ip" {
  instance = aws_instance.instance.id
  domain   = "vpc"
}

output "ssh_ip" {
  value = aws_eip.ssh_ip.public_ip
}
```

- 몇가지 바꿀만한 것을 보면
	- 2번째 줄의 `region`: 지금은 서울(`ap-northeast-2`) 로 되어있고 거의 바꿀 일이 없겠지만 혹시 다른 region 이 필요하다면 바꾸자.
	- 54번째 줄의 `public_key`: SSH public key path 를 바꿔주면 된다.
	- 58번째 줄의 `ami`: 지금은 Ubuntu 22.04 로 되어있는데, 다른 cloud image 를 사용할 거면 바꿔주면 된다.
		- Ubuntu 의 다른 AMI 들은 [여기](https://cloud-images.ubuntu.com/locator/ec2/) 에서 찾자.
	- 59번째 줄의 `instance_type`: 원하는 instance type 을 적어주면 된다.
		- GPU 를 사용하고싶다면 [이거](https://docs.aws.amazon.com/en_us/dlami/latest/devguide/gpu.html) 를 참고하자.
	- 66번째 줄의 `volume_size`: 원하는 disk size 를 적어주면 된다.
- Resouce 생성:

```bash
terraform init
terraform apply
```

- SSH 접속:

```sh
ssh -i /path/to/key.pub ubuntu@$(terraform output -raw ssh_ip)
```