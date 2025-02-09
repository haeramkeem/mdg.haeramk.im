---
tags:
  - shellscript
  - bash-git
date: 2025-02-07
aliases:
  - 기본 editor 를 VIM 으로 바꾸기
---
> [!info]- 참고한 것들
> - [스댕](https://stackoverflow.com/a/2596835)

## 개요

- `git` 에서 뭔가 하려고 할 때, `nano` editor 가 켜지는 경우가 있다.
- 근데 난 이게 싫다 이거야: 난 `vim` 을 쓰고 싶었다.

## TL;DR

- 요래 하면 된다.

```bash
git config --global core.editor "vim"
```

- 아니면 `~/.gitconfig` 를 직접 바꿔줘도 된다.

```
[core]
	editor = vim
```

- 그것도 아니면 env 로 해결할 수도 있다.

```bash
export GIT_EDITOR=vim
```