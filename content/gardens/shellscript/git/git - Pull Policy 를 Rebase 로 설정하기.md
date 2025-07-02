---
tags:
  - shellscript
  - bash-git
date: 2025-06-30
aliases:
  - Pull Policy 를 Rebase 로 설정하기
---
## TL;DR

- 기본적으로는 `git pull` 정책을 설정하지 않으면 pull 할 때 경고문구가 뜨는데, 이걸 방지하기 위해서는 (그리고 [[index|주인장]] 이 많이 쓰는 pull 정책이 rebase 이기 때문에) 아래와 같이 설정하면 된다.

```bash
git config --global pull.rebase true
```