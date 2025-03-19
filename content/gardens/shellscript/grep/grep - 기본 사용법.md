---
tags:
  - bash-grep
date: 2025-03-17
aliases:
  - grep
---
> [!info]- 참고한 것들
> - [스댕](https://stackoverflow.com/a/3213773)

## TL;DR

- 알다시피 `grep` 은 파일에서 특정 패턴의 문자열을 찾는 것이다.
- 기본적인 문법은:

```bash
grep ${PATTERN} ${FILE_NAME}
```

- 표준 출력을 pipe 로 받을 수도 있다:

```bash
${COMMAND} | grep ${PATTERN}
```

## 자주 사용하는 옵션들

- 찾은 패턴이 있는 줄 번호를 출력하려면 `-n` 옵션을 사용하면 된다:

```bash
grep -n ${PATTERN} ${FILE_NAME}
```

- 찾은 패턴이 존재하는 파일 이름만 출력하기를 원한다면 `-l` 옵션을 이용하면 된다:

```bash
grep -l ${PATTERN} ${FILE_NAME}
```

- 반대로 패턴이 없는 파일 이름만 출력하기를 원한다면 `-L` 옵션을 이용하면 된다:

```bash
grep -L ${PATTERN} ${FILE_NAME}
```

- 그리고 패턴이 없는 line 만을 출력하기를 원한다면 `-v` 옵션을 이용하면 된다:

```bash
grep -v ${PATTERN} ${FILE_NAME}
```