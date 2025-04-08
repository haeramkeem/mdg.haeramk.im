---
tags:
  - shellscript
  - bash-git
date: 2025-04-07
aliases:
  - Tag 추가하기
  - git tag
---
> [!info]- 참고한 것들
> - [어떤 블로그](http://minsone.github.io/git/git-addtion-and-modified-delete-tag)

## TL;DR

- git tag 는 특별한 commit 이라고 생각하면 된다: commit 들 중에서, 코드가 변경될 일 없는 약간 checkpoint 같은 놈이다.
	- 그래서 github 에서 release 를 할 때도 우선 이 tag 를 먼저 생성해야 한다.

```bash
git tag -a ${TAG_ANNOTATION} -m "${TAG_MESSAGE}"
```

- 여기서 tag annotation 은 commit hash 에 대응되는 개념이라고 생각하면 된다. 즉, hash 값이 아닌 "named commit" 인 셈.