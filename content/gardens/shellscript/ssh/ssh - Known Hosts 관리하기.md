---
tags:
  - bash-ssh
  - shellscript
date: 2025-03-24
---
> [!info]- 참고한 것들
> - [스댕](https://superuser.com/a/125326)

## Known Hosts

- ssh 에서는 보안을 위해서 처음 ssh 로 접속하는 서버에 대해서는 host verification checking 을 한다.
- 그래서 이때는 다음과 같은 메세지가 뜬다:

```
The authenticity of host '111.222.333.444 (111.222.333.444)' can't be established.
RSA key fingerprint is f3:cf:58:ae:71:0b:c8:04:6f:34:a3:b2:e4:1e:0c:8b.
Are you sure you want to continue connecting (yes/no)? 
```

- 그리고 여기서 `yes` 를 선택해야 ssh 로 접속이 된다.

### Disabling Host Verification

> [!tip] 신뢰할 수 있는 경우에만 사용할 것
> - 당연히 이것은 보안을 낮추는 것이기 때문에, 접속하고자 하는 서버가 신뢰할 수 있다는 것이 보장될 때만 사용하도록 하자.

- 근데 shell script 을 짜다 보면 이것때문에 에러가 발생하는 경우가 있다.
	- 즉, 자동으로 `yes` 가 아닌 입력이 들어가 verification 에 실패하는 것.
- 따라서 이것을 방지하기 위해서는 이런 옵션을 넣어줄 수 있다:

```bash
ssh -o "StrictHostKeyChecking no" user@host
```

### Failing Host Verification

> [!tip] 신뢰할 수 있는 경우에만 사용할 것
> - 마찬가지로 이것은 보안을 낮추는 것이기 때문에, 접속하고자 하는 서버가 신뢰할 수 있다는 것이 보장될 때만 사용하도록 하자.

- 그리고 만약에 IP 는 동일한데 server 가 바뀐 경우에는 자동으로 verification 에 실패한다.
	- 대표적으로 keepalived 같은 이중화를 하거나 EC2 인스턴스를 재생성하는 등의 상황에서 이런 문제가 발생할 수 있다.
- 그래서 만약에 신뢰할 수 있는 서버에 대해 이런 문제가 발생한다면, `~/.ssh/known_hosts` 에서 해당 IP 가 들어있는 줄을 삭제해주면 된다.

```bash
vi ~/.ssh/known_hosts
```