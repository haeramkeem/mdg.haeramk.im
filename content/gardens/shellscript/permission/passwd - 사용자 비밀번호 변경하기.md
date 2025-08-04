---
tags:
  - shellscript
  - bash-perm
date: 2025-07-21
aliases:
  - passwd
  - mkpasswd
---
> [!info]- 참고한 것들
> - [어떤 블로그](https://www.cyberciti.biz/faq/change-a-user-password-in-ubuntu-linux-using-passwd)

## TL;DR

- 사용자의 비밀번호를 변경할 때는 `passwd` 를 사용하면 된다.

```bash
sudo passwd ${유저 이름}
```

- Cloud-init 등에 password 를 제공할 때는 plaintext 가 아닌 hash digest 를 넘길 때도 있다. 이 때는 `mkpasswd` 를 사용하면 된다.

```bash
mkpasswd -m sha-512
```

- `mkpasswd` 를 사용할 때, stdin 으로부터 받고싶으면 `-s` 옵션을 사용하면 된다.

```bash
echo examplepassword | mkpasswd -m sha-512 -s
```