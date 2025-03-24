---
tags:
  - bash-sed
  - shellscript
date: 2025-03-24
---
> [!info]- 참고한 것들
> - [스댕](https://stackoverflow.com/a/17511700)

## TL;DR

- `sed` 를 사용할 때 기본적으로는 regex 를 사용하지 못한다.
- 따라서 regex 로 pattern matching 을 하고자 할 때는 `-r` 이나 `-E` 옵션을 사용하면 된다.

> [!tip] `-r` 와 `-E` 의 차이
> - 이 두가지는 동일하다. 다만 POSIX compatibility 를 위해서는 `-E` 를 사용하라고 권고한다.
> - 그리고 [[grep - 기본 사용법|grep]] 에서도 동일하게 `-E` 를 사용하기 때문에 그냥 `-E` 를 사용하자.

```bash
sed -r 's/PATTERN/NEW_PATTERN/' $FILE
```

```bash
sed -E 's/PATTERN/NEW_PATTERN/' $FILE
```