---
tags:
  - shellscript
  - bash-git
date: 2024-09-02
---
> [!info]- 참고한 것들
> - [Medium 블로그](https://medium.com/@aamir.shehzad3346875/how-to-sign-previous-commit-that-have-already-been-pushed-4683a7060e19)

## 왜?

- Github 에서 PR rule 을 지정할 때 "모든 commit 이 서명 (sign) 되어있어야 함" 이란 rule 을 강제할 수 있다.
- 근데 GPG 혹은 SSH 키를 변경하였을 경우 이전 키를 Github 에서 지우면 이전 commit 들이 `Unverfied` 상태가 될 수 있다.
- 이때 새로 생성한 키로 이전 commit 을 다시 서명하여 push 하는 것으로 문제를 해결할 수 있다.

## 어떻게?

- 일단 GPG 나 SSH key 를 새로 생성하여 Github 에도 등록되어있다는 가정 하에,
- 다음의 명령어로 interactive rebase 모드로 들어간다.
	- 여기서 `X` 는 commit 의 개수이다.

```bash
git rebase -i HEAD~X
```

- 그럼 다음과 같은 내용들로 이루어진 파일이 vim 으로 열릴 것이다.

```
pick {{ commit_hash }} {{ commit_message }}
pick 01234 ...
pick 56789 ...
pick 43210 ...
...
```

- 여기서 모든 줄의 다음에 이걸 추가해 준다.

```
exec git commit --amend --no-edit -s
```

- 즉,

```
pick {{ commit_hash }} {{ commit_message }}
exec git commit --amend --no-edit -s
pick 01234 ...
exec git commit --amend --no-edit -s
pick 56789 ...
exec git commit --amend --no-edit -s
pick 43210 ...
exec git commit --amend --no-edit -s
...
```

- 요로코롬 하고 저장하면 쭉 rebase 된다.
- 그 다음엔 `--force` 옵션을 붙여 push 해주면 된다.

```bash
git push --force origin ${BRANCH}
```