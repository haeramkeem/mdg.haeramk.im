---
tags:
  - shellscript
  - bash-ssh
date: 2025-02-05
aliases:
  - ssh keypair 추가 가이드
---
> [!info]- 참고한 것들
> - [스댕](https://stackoverflow.com/a/58894719)

## TL;DR

```
ssh-copy-id -f -i /path/to/pub_key username@hostname
```

- Local machine (내 컴터) [[ssh - Keypair 생성하기|ssh keypair 생성 가이드]] 로 keypair 를 생성한 뒤에 이 명령어로 remote machine (SSH 로 접속하고자 하는 놈) 에 public key 를 복사하고 auth 에 사용될 수 있도록 세팅해줄 수 있다.