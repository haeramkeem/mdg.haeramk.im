---
tags:
  - shellscript
  - bash-git
date: 2025-04-07
aliases:
  - 일부분만 add 하기
---
> [!info]- 참고한 것들
> - [스댕 - Hunk split](https://stackoverflow.com/a/6290646)

## TL;DR

- [[index|주인장]] 과 같이 git 에 집착하는 놈들은 그냥 `git add .` 해서 변경사항이 섞이는 것을 싫어한다.
- 그래서 일부분만 `git add` 해서 세부적으로 commit 을 달고자 하는 사람이라면, 이 기능이 유용할 것이니라.

```bash
git add -p ${FILE}
```

- `-p` 는 `--patch` 의 줄임이다. 이 옵션을 쓰게 되면, 파일 단위가 아닌 (하나의 파일 내에서도) 변경사항별로 stage 를 할 수 있는 화면이 출력된다.
	- 기본적으로 stage 를 하고싶으면 `y` 를, 하고싶지 않다면 `n` 을 선택하면 된다.

### Hunk

- *Hunk* 라는 것은 이렇게 patching 을 할 때 stage 하는 단위를 일컫는다.
- 근데 patch option 으로 hunk 를 확인해 보면 이것조차 맘에 안들때도 있다.
- 이때에는 patch 화면에서 `s` 을 선택하면 hunk 가 알아서 split 된다. 이렇게 split 된 hunk 에서 어떤 것을 stage 할 지 결정하면 된다.