---
tags:
  - Proxmox
date: 2024-04-22
---
> [!info]- 참고한 것들
> - [PVE 포럼](https://forum.proxmox.com/threads/add-new-disk-to-pve-newbie-question.98753/post-426627)

## HDD 마운트

- 다음의 명령어로 디스크를 날려주고

```
sgdisk --zap-all /dev/sda
```

- GUI 에서 `(Node 이름)` -> `Disks` -> `Directory` -> `Create: Directory` 에서 추가해 주면 된다.