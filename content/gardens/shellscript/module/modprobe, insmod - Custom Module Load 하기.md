---
tags:
  - shellscript
  - bash-mod
date: 2025-07-28
---
## TL;DR

- Kernel module 을 하나 만들었다고 했을 때 ([[세상 간단한 Kernel module 예시 (C Linux Kernel)|세상 간단한 Kernel module 예시]]), 이놈을 어떻게 load 할 수 있을까.
- 우선 `insmod` 를 사용하면 바로 이 compile 된 `.ko` 파일을 load 할 수 있다.

```bash
sudo insmod ${Module 파일}.ko
```

- 만약에 [[modprobe, lsmod, rmmod - 기본 사용법|modprobe]] 를 사용하고싶다면, 다음와 같이 하면 된다.
- [[modprobe, lsmod, rmmod - 기본 사용법|여기]] 에서 말한 것 처럼, `modprobe` 는 `/lib/modules/${커널 버전}` 에서 `.ko` 를 찾는다. 따라서 여기에 컴파일한 `.ko` 를 넣어주면 된다.

```bash
sudo mv ${Module 이름}.ko /lib/modules/$(uname -r)/
```

- 그리고 `depmod` 로 refresh 해주고 `modprobe` 로 load 해주면 된다.
	- 여기서 중요한 점은 `modprobe` 로 load 하는 module 이름은 `.ko` 확장자를 뺀 이름이어야 한다는 것이다.

```bash
sudo depmod
sudo modprobe ${Module 이름}.ko
```