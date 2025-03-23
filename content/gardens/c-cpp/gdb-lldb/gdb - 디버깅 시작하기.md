---
tags:
  - gdb
date: 2024-11-22
aliases:
  - gdb
  - lldb
---
> [!info]- 참고한 것들
> - [스댕 - ptrace](https://stackoverflow.com/a/32274645)
> - [스댕 - args](https://stackoverflow.com/a/6121299)

## 개요

> [!info] Scope
> - 이 글의 범위는 처음 `gdb` 혹은 `lldb` 를 설치하고 session 을 시작하는 것 까지이고,
> - `gdb`, `lldb` 를 위한 compile option 이나 session 내에서의 command 는 여기서 다루지 않는당.

- `gdb` 는 `gcc` 의 debug tool 이고, `lldb` 는 LLVM 의 debug tool 이다.
- 인데 이 둘다 유사한 점이 많기 때문에, 싸잡아서 정리해 보는 사용법

## `gdb`

- 일단 `build-essential` 같은거로 `gcc` 를 설치해도 `gdb` 가 같이 설치되지는 않는다.
- 그래서 우선 `gdb` 를 설치해줘야 함

```bash
sudo apt-get install -y gdb
```

- 그리고 session 을 시작할 때는 binary 이름을 넣거나

```bash
gdb /path/to/binary
```

- 특정 PID 를 분석하고 싶다면, `-p` 옵션을 사용해 주면 된다.
	- 다만 이때는 `ptrace` 설정에 따라 에러가 날 수 있다.
	- 만약에 `ptrace: Operation not permitted.` 와 같은 에러가 난다면,
	- `sysctl` 에서 `kernel/yama/ptrace_scope` 설정을 `0` 으로 바꿔주자.

```bash
gdb -p $PID
```

- Program arguments 를 넣고싶다면, `--args` 옵션을 사용하면 된다.

```sh
gdb --args /path/to/binary arg1 arg2
```

## `lldb`

> [!warning] #draft 
> - `lldb` 는 나중에 정리할란다