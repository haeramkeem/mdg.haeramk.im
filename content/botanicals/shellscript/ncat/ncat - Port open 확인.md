---
tags:
  - 쉘스크립트
  - bash-ncat
date: 2024-07-09
---
## TL;DR

- 0-byte message 를 보내 port 가 열려있는지 확인만 할때는 다음과 같이 하면 된다:

```bash
ncat -vz ${IP} ${PORT}
```