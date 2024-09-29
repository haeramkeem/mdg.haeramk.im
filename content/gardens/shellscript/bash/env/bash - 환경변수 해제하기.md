---
tags:
  - shellscript
  - bash-env
date: 2024-09-30
---
> [!info]- 참고한 것들
> - [스댕](https://superuser.com/a/154338)

## TL;DR

- 환경변수를 해제할 때는 `unset` 을 사용하면 된다.

```bash
unset ${VARIABLE_NAME}
```

- 함수를 해제할 때는 `-f` 옵션을 사용하면 된다.

```bash
unset -f ${FUNCTION_NAME}
```