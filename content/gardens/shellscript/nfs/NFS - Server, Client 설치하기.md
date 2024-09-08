---
tags:
  - shellscript
  - bash-nfs
date: 2024-08-30
---
> [!info]- 참고한 것들
> - [설정 참고 - DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-set-up-an-nfs-server-using-block-storage)
> - [스댕 - fstab 설정](https://askubuntu.com/a/890989)
> - [스댕 - exportfs 설정](https://serverfault.com/a/862966)

## Server 설정

- Install

```bash
sudo apt-get update
sudo apt-get install -y nfs-kernel-server
sudo mkdir -pv /path/to/export
```

- `/etc/exportfs`

```
/path/to/export        *(rw,sync,no_subtree_check)
```

- Restart server

```bash
sudo systemctl restart nfs-server
```

## Client 설정

- Install

```bash
sudo apt-get update
sudo apt-get install -y nfs-common
sudo mkdir -pv /path/to/mount
```

- `/etc/fstab`

```bash
server.ip:/path/to/export    /path/to/mount    nfs    defaults    0 0
```

- Mount

```bash
sudo mount -a
```