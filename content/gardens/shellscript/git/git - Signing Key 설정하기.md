---
tags:
  - shellscript
  - bash-git
date: 2025-05-12
aliases:
  - Signing Key 설정하기
---
> [!info]- 참고한 것들
> - [공문](https://docs.github.com/en/authentication/managing-commit-signature-verification/telling-git-about-your-signing-key#telling-git-about-your-ssh-key)

## TL;DR

- Git commit 에 대해, 서명을 하도록 할 수 있다.
	- 가령 GitHub 에서는 서명이 되어 있는 commit 에 대해서는 다음과 같은 메세지가 뜬다 ([공문](https://docs.github.com/en/authentication/managing-commit-signature-verification/displaying-verification-statuses-for-all-of-your-commits)):

![[Pasted image 20250512193121.png]]

- 이를 위해, [[git - GitLab private server 에 SSH key 추가하기|기존에 사용하던 ssh key]] 로 commit message 를 서명하도록 할 수 있다.
- 다음의 `git config --global` 으로 설정을 해줄 수 있다.

```bash
git config --global gpg.format ssh
git config --global user.signingkey /path/to/public_key
git config --global commit.gpgsign true
```