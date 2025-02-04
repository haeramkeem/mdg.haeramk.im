---
tags:
  - shellscript
  - bash-git
date: 2025-02-04
---
> [!info]- 참고한 것들
> - [GitLab SSH key 가이드](https://docs.gitlab.com/ee/user/ssh.html)
> - [스댕 - 400 error](https://stackoverflow.com/a/32696060)

## TL;DR

1. SSH key 를 생성한다.
	- 아래 명령어의 옵션들은 사실 필요 없긴 하다.
		- `-t`: 굳이 RSA key 일 필요는 없다.
		- `-b`: 굳이 2048 bit 일 필요도 없다.
		- `-C`: 굳이 comment 를 지울 필요도 없다. 근데 `username@hostname` 으로 comment 가 자동으로 붙는게 뵈기 싫어서 지움

```bash
ssh-keygen -t rsa -b 2048 -C ""
```

2. SSH config 을 작성한다.

```
Host ${alias 적당히}
	HostName ${주소}
	Port ${포트번호}
	PreferredAuthentications publickey
	IdentityFile ${SSH key 경로}
```

3. SSH public key 를 등록한다.
	- 이건 github 인지 gitlab 인지 등에 따라 다르다. 적당히 개인 설정에서 찾아서 등록하자.
4. 다음의 명령어로 잘 되는지 확인하자.

```bash
ssh -T git@${위에 적은 alias}
```

- 다음과 같이 나오면 정상이다.

```
Welcome to GitLab, ${이름}!
```

## Troubleshoot

### Case 1. 400 Bad Request

- 만약 위의 명령어 (`ssh -T`) 를 실행했을 때 잘 안되면 verbose level 을 늘려서 debug 해보자.

```bash
ssh -Tvvv git@${위에 적은 alias}
```

- 이때, 다음과 같이 `400 Bad Request` 라는 HTTP status 가 돌아온다면,

![[Pasted image 20250204213130.png]]

- 이 말은 (어찌보면 당연한건데) SSH port 가 아닌 HTTP port 로 접근했기 때문이다.
	- 보통 SSH port 를 22가 아닌 딴것으로 설정해놓았을 때 ssh 에 port config 를 잘못하면서 이런 실수(?) 가 생기기도 한다.
	- SSH port 를 정확히 확인해서 설정하도록 하자.