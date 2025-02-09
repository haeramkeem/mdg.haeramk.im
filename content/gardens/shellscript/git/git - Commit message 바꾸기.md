---
tags:
  - shellscript
  - bash-git
date: 2025-02-07
aliases:
  - Commit message 바꾸기
---
> [!info]- 참고한 것들
> - [GitHub 공문](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/changing-a-commit-message)

## TL;DR

- `N` 개의 commit 을 바꾸려고 할 때,

```bash
git rebase -i HEAD~N
```

- 이것을 실행하면 editor 가 열리면서 다음과 같은 내용이 뜰 것이다.

```
pick e499d89 어떤 커밋 메세지
pick 0c39034 또 다른 커밋 메세지
pick f7fde4a 또 또 다른 커밋 메세지

# Rebase 9fdb3bd..f7fde4a onto 9fdb3bd
#
# Commands:
# p, pick = use commit
# r, reword = use commit, but edit the commit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup = like "squash", but discard this commit's log message
# x, exec = run command (the rest of the line) using shell
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
# Note that empty commits are commented out
```

- 여기서 바꾸고자 하는 commit 을 `pick` 에서 `reword` 로 바꿔주고 저장하고 종료한다.
- 그럼 또 editor 가 열리면서 이런게 뜬다.

```
어떤 커밋 메세지

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# Date: ...
#
# interactive rebase in progress; onto ...
# Last commands done (3 commands done):
#    ...
# No commands remaining.
# You are currently editing a commit while rebasing branch '...' on '...'.
#
# Changes to be committed:
#       ...
#
```

- 여기 적혀있는 커밋 메세지를 바꿔주고 저장하면 된다.