---
tags:
  - 쉘스크립트
  - bash-cut
date: 2024-07-02
---
> [!info]- 참고한 것들
> - [스댕](https://stackoverflow.com/a/38905821)

## TL;DR

```sh
echo "kfc,bhc,bbq,dfc" | cut -d ',' -f 1
```

- 결과는 `kfc` 이다 (0-index 아님)