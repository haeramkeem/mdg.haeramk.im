---
tags:
  - shellscript
  - bash-perm
date: 2025-07-21
aliases:
  - groupadd
---
> [!info]- 참고한 것들
> - [공문](https://linux.die.net/man/8/groupadd)
> - [어떤 블로그](https://www.cyberciti.biz/faq/linux-change-user-group-uid-gid-for-all-owned-files/)

## TL;DR

- Group 을 생성하려면 `groupadd` 를 사용하면 된다.
	- `-r`: 해당 그룹을 system group 으로 만든다.

```bash
sudo groupadd -r -g ${그룹 ID} ${그룹 이름}
```

- 생성한 group 을 변경하려면 `groupmod` 를 사용하면 된다.

```bash
sudo groupmod -g ${새로운 그룹 ID} ${그룹 이름}
```