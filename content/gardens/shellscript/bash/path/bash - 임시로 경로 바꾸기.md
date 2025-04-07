---
tags:
  - bash-path
date: 2025-03-31
aliases:
  - pushd
  - popd
---
## TL;DR

- 임시로 경로를 바꾸어서 뭔가를 하고, 다시 원래 위치로 돌아오고자 할 때는 `pushd` 와 `popd` 를 사용하면 된다.

```bash
pushd $경로
# 작업...
popd
```

- Stack 생각하면 된다. `pushd 경로` 를 하면 stack 에 해당 경로를 쌓으며 경로를 바꾸고, `popd` 를 하면 stack 에서 경로를 빼며 원래 위치로 돌아가게 되는 것.