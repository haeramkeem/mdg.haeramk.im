---
tags:
  - 쉘스크립트
---
> [!info] [출처](https://serverfault.com/a/805008)
## TL;DR!

- 이래 하면 된다.

```bash
tcpdump -i ${INTERFACE_NAME}
```

- 만약 모든 인터페이스를 캡쳐하고 싶다면,

```bash
tcpdump -i any
```

- 요렇게 하면 된다.