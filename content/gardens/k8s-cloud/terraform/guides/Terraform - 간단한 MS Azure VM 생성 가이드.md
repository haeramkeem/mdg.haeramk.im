---
tags:
  - terraform
  - guides
date: 2025-06-12
---
> [!info] 이 글의 목적
> - 이 글은 제대로 terraform 및 클라우드를 파보는 글이 아닌, 전직 클라우드 엔지니어가 적는 "아닌 밤중에 갑자기 Azure VM 하나가 필요할 때 얼른 만들어서 사용하기 위한 가이드" 입니다.

## TL;DR

> [!tip] `az` 설치
> - [MS Azure 공식문서](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)

- 우선 `az` 로 로그인해준다.

```bash
az login
```

- 다음으로는 subscription ID 를 확인해준다.

```bash
az account show --query id -o tsv
```

- 그 다음에 이걸 사용하면 된다.

```terraform title="main.tf" {3,73,80,86,89-94}
provider "azurerm" {
  features {}
  subscription_id = "SUBSCRIPTION_ID"
}

resource "azurerm_resource_group" "default" {
  name     = "rg-default"
  location = "Korea Central"
}

resource "azurerm_virtual_network" "default" {
  name                = "vnet-default"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.default.location
  resource_group_name = azurerm_resource_group.default.name
}

resource "azurerm_subnet" "default" {
  name                 = "subnet-default"
  resource_group_name  = azurerm_resource_group.default.name
  virtual_network_name = azurerm_virtual_network.default.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_public_ip" "ssh" {
  name                = "ssh-ip"
  location            = azurerm_resource_group.default.location
  resource_group_name = azurerm_resource_group.default.name
  allocation_method   = "Static"
  sku                 = "Standard"
}

resource "azurerm_network_security_group" "ssh" {
  name                = "ssh-nsg"
  location            = azurerm_resource_group.default.location
  resource_group_name = azurerm_resource_group.default.name

  security_rule {
    name                       = "SSH"
    priority                   = 1001
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

resource "azurerm_network_interface" "default" {
  name                = "nic-default"
  location            = azurerm_resource_group.default.location
  resource_group_name = azurerm_resource_group.default.name

  ip_configuration {
    name                          = "nic-config"
    subnet_id                     = azurerm_subnet.default.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.ssh.id
  }
}

resource "azurerm_network_interface_security_group_association" "default" {
  network_interface_id      = azurerm_network_interface.default.id
  network_security_group_id = azurerm_network_security_group.ssh.id
}

resource "azurerm_linux_virtual_machine" "vm_instance" {
  name                = "vm-instance"
  resource_group_name = azurerm_resource_group.default.name
  location            = azurerm_resource_group.default.location
  size                = "Standard_D4as_v6"
  admin_username      = "ubuntu"
  network_interface_ids = [azurerm_network_interface.default.id]
  disable_password_authentication = true

  admin_ssh_key {
    username   = "ubuntu"
    public_key = file("/path/to/key.pub")
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
    disk_size_gb         = 128
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts-gen2"
    version   = "latest"
  }
}

output "ssh_ip" {
  value = azurerm_public_ip.ssh.ip_address
}

```

- 몇가지 바꿀만한 것을 보면
	- 3번째 줄의 `subscription_id`: 위에서 확인한 subscription ID 를 적어주면 된다.
	- 73번째 줄의 `size`: 사용할 instance type. 지금은 `Standard_D4as_v6` 이다.
		- Machine type 은 [이거](https://azure.microsoft.com/en-us/pricing/details/virtual-machines/linux) 를 참고하자.
	- 80번째 줄의 `public_key`: 사용할 SSH key 경로.
	- 86번째 줄의 `disk_size_gb`: 사용할 디스크의 크기 (GB). 지금은 128G 이다.
	- 89 ~ 94번째 줄의 `source_image_reference`: 사용할 OS image. 지금은 Ubuntu 22.04 이다.

- Resouce 생성:

```bash
terraform init
terraform apply
```

- SSH 접속:

```sh
ssh -i /path/to/key ubuntu@$(terraform output -raw ssh_ip)
```