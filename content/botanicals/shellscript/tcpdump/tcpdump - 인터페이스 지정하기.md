---
tags:
  - 쉘스크립트
---
> [!info] [출처](https://serverfault.com/a/805008)
## 개요

- `tcpdump` 에서 별도 인터페이스를 지정지 않으면 기본 인터페이스로 설정된다.
- 하지만 인터페이스가 여러개여서 그중 특정 인터페이스를 캡쳐하고 싶거나, 모든 인터페이스를 캡쳐하고 싶다면 요래 하면 된다.

## TL;DR!

```bash
tcpdump -i ${INTERFACE_NAME}
```

- 만약 모든 인터페이스를 캡쳐하고 싶다면,

```bash
tcpdump -i any
```

- 요렇게 하면 된다.