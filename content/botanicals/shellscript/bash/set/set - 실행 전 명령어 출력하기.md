---
tags:
  - 쉘스크립트
  - bash-set
date: 2024-07-02
---
> [!info]- 참고한 것들
> - [스댕](https://stackoverflow.com/a/2853811)


## TL;DR

- 이놈은 스크립트 내의 환경변수들을 실제 값으로 치환까지 해서 출력해준다.

```sh
set -x
# 혹은
set -o xtrace
```

- 이놈은 치환하지 않고 출력해준다고 한다.

```sh
set -v
# 혹은
set -o verbose
```