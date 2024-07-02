---
tags:
  - 쉘스크립트
  - bash-cut
date: 2024-07-02
---
> [!info]- 참고한 것들
> - [스댕](https://stackoverflow.com/a/22727211)

## TL;DR

```sh
echo "kfc,bhc,bbq,dfc" | rev | cut -d ',' -f 1 | rev
```

- 결과는 `dfc` 이다.