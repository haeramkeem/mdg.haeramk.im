---
tags:
  - shellscript
  - bash-ssh
date: 2025-02-05
aliases:
  - ssh config 가이드
---
## TL;DR

```
Host ${ALIAS}
	HostName ${IP_OR_URL}
	Port ${PORT}
	PreferredAuthentications publickey
	IdentityFile /path/to/priv_key
```

- `${ALIAS}`: 여기 적어준 alias 를 이용해 `ssh ${ALIAS}` 로 접속할 수 있다.
- `HostName`, `Port`: SSH server endpoint 정보
- `PreferredAuthentications`, `IdentityFile`: SSH key 정보
	- `PreferredAuthentications` 로 passwd 보다 public key auth 를 우선적으로 사용할 수 있다.