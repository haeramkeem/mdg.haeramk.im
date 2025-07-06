---
tags:
  - shellscript
  - bash-git
date: 2025-06-07
---
> [!info]- 참고한 것들
> - [스댕](https://stackoverflow.com/a/822859)

## TL;DR

- `git diff` 로 변경사항을 추적할 수 있는데, 이놈으로 branch 간 비교도 가능하다.

### 변경사항 출력하기

- 일단 그냥 branch 이름을 적으면 현재 branch 와 적어준 branch 를 비교한다.

```bash
git diff ${타겟 branch}
```

- 그리고 두 branch 를 `..` 으로 연결하면 두 branch 를 비교한다.

```bash
git diff ${첫번째 branch}..${두번째 branch}
```

### 변경된 파일 이름 출력하기

- 변경된 파일 이름을 출력하는것은 `--name-status` 옵션을 사용하면 된다.
- 사용법은 위와 동일하게 branch 하나를 적어주면 현재 branch 와 비교하고

```bash
git diff --name-status ${타겟 branch}
```

- `..` 로 두 branch 를 적어주면 이 두 branch 를 비교한다.

```bash
git diff --name-status ${첫번째 branch}..${두번째 branch}
```