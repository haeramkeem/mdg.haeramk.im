---
tags:
  - shellscript
  - bash-perm
date: 2025-07-21
aliases:
  - useradd
  - usermod
  - userdel
---
> [!info]- 참고한 것들
> - [공문](https://linux.die.net/man/8/useradd)
> - [어떤 블로그](https://www.cyberciti.biz/faq/linux-change-user-group-uid-gid-for-all-owned-files/)
> - [어떤 블로그 - userdel](https://stackdiary.com/tutorials/delete-user-in-ubuntu/)

## TL;DR

- 사용자를 추가할 때는 `useradd` 를 사용하면 된다.
	- `-r`: 해당 유저를 system user 로 만든다.
	- `-m`: 홈 디렉토리 (`/home/${유저 이름}`) 을 같이 만든다.

```bash
sudo useradd -r -m -g ${그룹 ID} -u ${유저 ID} ${유저 이름}
```

- 생성한 사용자를 변경할 때는 `usermod` 를 사용하면 된다.

```bash
sudo usermod -u ${새로운 유저 ID} ${유저 이름}
```

- 사용자를 삭제할 때는 `userdel` 을 사용하면 된다.

```bash
sudo userdel -r ${유저 이름}
```