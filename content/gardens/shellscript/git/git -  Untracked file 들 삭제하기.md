---
tags:
  - shellscript
  - bash-git
date: 2025-06-16
aliases:
  - Untracked file 들 삭제하기
---
> [!info]- 참고한 것들
> - [스댕](https://stackoverflow.com/a/3801342)

## TL;DR

- 임시 파일들을 많이 만들었을 경우 얘네들을 정리하는 것이 필요하다.
- 물론 `gitignore` 로 무시하게 할 수 있긴 하지만 뭐 압축해서 옮기거나 할 때 이런 쓸데없는 파일들을 다 지워주고 싶은 욕구가 많이 생길것이야.
- 그럼 요래 하면 된다.

```bash
git clean -dfx
```