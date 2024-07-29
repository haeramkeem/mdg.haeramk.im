---
tags:
  - 쉘스크립트
  - apt
  - linux-kernel
  - bash-apt
date: 2024-04-24
---
> [!info]- 참고한 것들
> - [스댕 - kernel upgrade](https://askubuntu.com/a/1366065)
> - [스댕 - kernel header 가 필요한 이유](https://stackoverflow.com/a/54249888)

## TL;DR

- 이걸로 설치하고자 하는 커널을 고르고
	- 아래 예시는 `6.x.x` 버전의 generic kernel 을 검색하는 것이다.
	- 그냥 `linux-image` 로 검색하면 다 나옴

```bash
sudo apt-cache search linux-image-6.*-generic
```

- 이렇게 설치한 뒤

```bash
sudo apt-get install -y linux-image-6.5.0-28-generic linux-headers-6.5.0-28-generic
```

- 재부팅해주면

```bash
sudo reboot
```

- 된다.

```bash
uname -r
# 6.5.0-28-generic
```

## 첨언

- `apt-get upgrade` 로는 mainline kernel version 의 release 만 업그레이드하는 듯하다.
	- 즉, `5.15.0-96` 이었으면 `5.15.0-105` 가 되는
	- 물론 주인장의 생각이다. 방금 해봤을 때에는 `6.x.x` 로 업그레이드해주지는 않더라.