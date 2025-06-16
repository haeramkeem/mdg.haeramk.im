---
tags:
  - shellscript
  - bash-git
date: 2025-06-16
aliases:
  - Commit hash 출력하기
---
> [!info]- 참고한 것들
> - [스댕](https://stackoverflow.com/a/31448684)

## TL;DR

- 간혹 임시 파일의 이름을 짓는다거나 할 때 가장 최신의 commit hash 를 보고싶을 수 있다.
- 물론 이건 `git log` 로 보면 되긴 하지만 뭐 shellscipt 를 작성하거나 할 때는 어떻게 해야 되나.
- 요래 하면 된다.

```bash
git rev-parse --short HEAD
```