---
tags:
  - shellscript
  - bash-apt
date: 2024-01-11
---
> [!info]- 참고한 것들
> - [Ask ubuntu](https://askubuntu.com/a/17829)
> - [Debian WiKi](https://wiki.debian.org/PackageManagement/Searching)

## 개요

- 서버에 설치된 모든 패키지 확인
- 혹은, 서버에 특정 패키지가 설치되어있는지 확인 하는 용도로 사용할 수 있다.

## TL;DR

```bash
sudo apt list --installed
```

- 기본적으로는 모든 설치된 패키지가 출력되고, 특정 패키지로 필터링하고 싶으면 명령어 뒤에 적어주거나 아니면 `grep` 을 사용하면 된다.

## Debian Package (`dpkg`) 사용

- `dpkg` 로도 동일한 작업을 할 수 있다.
- 이때 사용되는 옵션은 `-l` 으로, 다음처럼 출력한 다음 `grep` 으로 필터링하던지

```bash
sudo dpkg -l | grep ${PKG_NAME}
```

- 아니면 `-l` 옵션의 인자로 줘도 된다.

```bash
sudo dpkg -l ${PKG_NAME}
```