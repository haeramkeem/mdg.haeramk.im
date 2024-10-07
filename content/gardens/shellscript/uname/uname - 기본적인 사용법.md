---
tags:
  - shellscript
  - bash-uname
date: 2024-09-30
---
## TL;DR

- `uname` 은 system 의 정보를 보기 위해 사용된다.
- 옵션 없이 사용하면 kernel 종류가 나온다.

```bash
uname
```

- Linux 에서는 다음처럼 나오고,

![[Pasted image 20240930082207.png]]

- Mac 에서는 다음과 같이 나온다.

![[Pasted image 20240930082243.png]]

### 옵션들

#### `-a`

- 는 종합적인 정보를 출력해 준다 (all).

```bash
uname -a
```

- Linux

![[Pasted image 20240930082704.png]]

- Mac

![[Pasted image 20240930082642.png]]

#### `-r`

- 를 사용하면 kernel release version 을 출력할 수 있다.

```bash
uname -r
```

- Linux

![[Pasted image 20240930082426.png]]

- Mac

![[Pasted image 20240930082440.png]]