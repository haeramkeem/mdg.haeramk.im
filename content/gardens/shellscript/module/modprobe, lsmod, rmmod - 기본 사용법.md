---
tags:
  - shellscript
  - bash-mod
date: 2025-07-28
aliases:
  - modprobe
  - lsmod
  - rmmod
---
## TL;DR

- Modprobe 로 module 을 load 할 때는 그냥 이렇게 하면 된다:

```bash
sudo modprobe ${Module 이름}
```

- 반대로 unload 할 때는 `-r` (`--remove`) 를 하면 된다.

```bash
sudo modprobe -r ${Module 이름}
```

- 아니면 `rmmod` 를 사용할 수도 있다.

```bash
sudo rmmod ${Module 이름}
```

- 지금 어떤 module 이 load 되어있는지 보려면 `lsmod` 를 사용하면 된다.
	- 특정 module 을 찾을 때는 당연히 `grep` 을 사용하면 된다.

```bash
lsmod
```

### Loadable Module 확인

- `modprobe` 는 `/lib/modules/${커널 버전}` 경로에서 `.ko` 파일을 찾아 load 한다.
- 그래서 내가 어떤 module 을 load 할 수 있는지 확인하려면 아래의 명령어를 사용하면 된다.
	- 그럼 특정 module 을 찾을 때는 당연히 `grep` 을 사용하면 된다.

```bash
sudo find /lib/modules/$(uname -r)
```