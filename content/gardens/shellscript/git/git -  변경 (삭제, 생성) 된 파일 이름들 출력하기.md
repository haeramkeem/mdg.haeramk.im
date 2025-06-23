---
tags:
  - shellscript
  - bash-git
date: 2025-06-16
aliases:
  - 변경 (삭제, 생성) 된 파일 이름들 출력하기
---
> [!info]- 참고한 것들
> - [스댕](https://stackoverflow.com/a/3801554)

## TL;DR

- `git status` 를 하면 변경/삭제/생성된 파일들을 볼 수 있다.
- 하지만 만약 이것을을 리스트업해서 shellscript 를 짜고자 한다면 `git ls-files` 를 사용하면 된다.

### 변경된 파일 리스트

- `-m` 옵션을 사용하면 변경된 파일들을 보여준다.

```bash
git ls-files -m --exclude-standard
```

### 생성된 파일 리스트

- `-o` 옵션을 사용하면 생성된 파일들을 보여준다.

```bash
git ls-files -o --exclude-standard
```

### 삭제된 파일 리스트

- `-d` 옵션을 사용하면 삭제된 파일들을 보여준다.

```bash
git ls-files -d --exclude-standard
```