---
tags:
  - 쉘스크립트
  - bash-if
date: 2024-03-05
---
## 개요

- 파일(혹은 디렉토리) 가 존재하는지 조건문에서 검사하기

## TL;DR!

### 파일 존재 확인

- 아래 세 가지 방법 중 하나 사용하면 되니다

```bash
if test -f $FILE_PATH; then
    echo exists
fi
```

```bash
if [ -f $FILE_PATH ]; then
    echo exists
fi
```

```bash
if [[ -f $FILE_PATH ]]; then
    echo exists
fi
```

### 디렉토리 존재 확인

- 마찬가지로 아래 세 가지 방법 중 하나 사용하면 된다

```bash
if test -d $FILE_PATH; then
    echo exists
fi
```

```bash
if [ -d $FILE_PATH ]; then
    echo exists
fi
```

```bash
if [[ -d $FILE_PATH ]]; then
    echo exists
fi
```