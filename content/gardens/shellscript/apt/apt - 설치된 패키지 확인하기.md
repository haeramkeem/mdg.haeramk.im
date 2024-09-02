---
tags:
  - shellscript
  - bash-apt
date: 2024-01-11
---
> [!info] [출처](https://askubuntu.com/a/17829)

## 개요

- 서버에 설치된 모든 패키지 확인
- 혹은, 서버에 특정 패키지가 설치되어있는지 확인 하는 용도로 사용할 수 있다.

## TL;DR

```bash
sudo apt list --installed
```

- 기본적으로는 모든 설치된 패키지가 출력되고, 특정 패키지로 필터링하고 싶으면 명령어 뒤에 적어주거나 아니면 `grep` 을 사용하면 된다.