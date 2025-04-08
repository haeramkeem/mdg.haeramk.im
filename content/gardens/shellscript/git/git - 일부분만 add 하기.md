---
tags:
  - shellscript
  - bash-git
date: 2025-04-07
aliases:
  - 일부분만 add 하기
---
## TL;DR

- [[index|주인장]] 과 같이 git 에 집착하는 놈들은 그냥 `git add .` 해서 변경사항이 섞이는 것을 싫어한다.
- 그래서 일부분만 `git add` 해서 세부적으로 commit 을 달고자 하는 사람이라면, 이 기능이 유용할 것이니라.

```bash
git add -p ${FILE}
```

- `-p` 는 `--patch` 의 줄임이다. 이 옵션을 쓰게 되면, 파일 단위가 아닌 (하나의 파일 내에서도) 변경사항별로 add 를 할 수 있는 화면이 출력된다.