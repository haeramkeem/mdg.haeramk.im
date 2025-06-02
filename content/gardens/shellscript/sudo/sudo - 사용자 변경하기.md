---
tags:
  - shellscript
  - bash-sudo
aliases:
  - sudo
date: 2025-05-26
---
> [!info]- 참고한 것들
> - [스댕](https://serverfault.com/a/70742)

## TL;DR

- `sudo` 는 대부분 알다시피 superuser 로 어떤 command 를 실행시키기 위한 명령어이다.

```bash
sudo mycommand
```

- 즉, 이놈도 하나의 명령어고 이 명령어의 argument 로 받은 것들을 superuser 로 실행시킨다는 것이다.
- 따라서 많이 실수하는 것이 `sudo` 를 잘못된 곳에 사용하는 것이다. 아래 예시를 보자.

```bash
sudo echo "something" > /root/file
```

- Superuser 소유의 파일인 `/root/file` 에 `"something"` 을 redirect (`>`) 로 적으려고 할 때, 무심코 위와 같이 하게 된다. 하지만 이렇게 하면 permission 에러가 나는 것을 볼 수 있다.
- 왜냐면 `echo` 는 `sudo` 로 superuser 로 실행하지만, redirect 한 이후에는 다시 일반 user 로 돌아오기 때문.
- 따라서 이 때에는 이렇게 해야 된다:

```bash
echo "something" | sudo tee /root/file
```

- [[tee - 기본 사용법|tee]] 를 superuser 로 실행시켜주면 아무런 문제 없이 할 수 있게 된다.

### 사용자 바꾸기

- 사실 `sudo` 의 역할은 명령어를 실행할 user 를 변경하는 것이고, 이 user 를 명시하지 않았을 때 superuser 로 실행하는 것이다.
- 어떤 명령어를 원하는 user 로 실행시키고 싶다면, `-u` 옵션을 사용해 주면 된다.

```bash
sudo -u myuser mycommand
```