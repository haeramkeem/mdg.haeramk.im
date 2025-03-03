---
tags:
  - cgroup
date: 2025-03-01
---
> [!info]- 참고한 것들
> - [스댕 - rootless cgexec](https://unix.stackexchange.com/a/741631)

## TL;DR

- 구체적인 설명은 나중에 하도록 하고, 그냥 간단하게 cgroup 으로 `ls` 를 실행하는 방법에 대해 알아보자.
- 우선 `cgcreate` 로 cgroup 을 생성한다.
	- 여기서 `memory,cpu` 는 memory 와 cpu 를 cgroup 으로 제한한다는 의미라고 생각하면 된다.
		- 하나만 제한하고자 한다면 그놈만 적어주면 된다.
	- 그리고 이름은 아래 예제에서는 `/mygroup` 이라고 했는데, 다른식으로 적어줘도 된다.
		- 즉, `mygroup` 처럼 `/` 를 빼도 되고
		- `mygroup.slice` 처럼 뒤에 `.slice` 를 붙이기도 한다.

```bash
sudo cgcreate -g memory,cpu:/mygroup
```

- 실행 후 아무것도 안뜨면 정상이다.
- 그리고 `cgexec` 으로 프로세스 (즉, `ls`) 를 실행한다.

```bash
sudo cgexec -g memory,cpu:/mygroup ls /
```

- 그럼 다음과 같이 나온다.

![[Pasted image 20250303113542.png]]

- 마지막으로 다음과 같이 생성한 cgroup 을 지운다.

```bash
sudo cgdelete -g memory,cpu:/mygroup
```

### `cgexec` sudo 없이 사용하기

- shellscript 등에서 `cgexec` 을 sudo 없이 사용하는 경우가 있는데, 이때는 cgroup 을 생성할 때 이렇게 해주면 된다.
- 일단 `cgcreate` 에서 `-a` 와 `-t` option 을 준다.

```bash
sudo cgcreate -t $USER:$USER -a $USER:$USER -g memory,cpu:/mygroup
```

- 그럼 sudo 없이 cgexec 을 해도 잘 된다.

```bash
cgexec -g memory,cpu:/mygroup ls /
```

![[Pasted image 20250303113938.png]]