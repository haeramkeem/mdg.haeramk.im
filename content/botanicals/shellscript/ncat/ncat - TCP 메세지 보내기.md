---
tags:
  - 쉘스크립트
  - bash-ncat
date: 2024-07-09
---
## TL;DR

```bash
ncat ${IP} ${PORT}
```

- 위 명령어는 TCP conn 와 TTY 을 계속 열어놓아 메세지를 보낼 수 있게 한다.
- 메세지를 한번만 보내고 싶을 때에는 표준입력을 사용하면 된다.

```bash
ncat $IP $PORT <<< "message"
```