---
tags:
  - shellscript
  - bash-apt
date: 2024-01-11
---
## 개요

- apt 로 패키지 지우는 방법
	- 을 왜 굳이 메모를 해놓냐 -> apt, yum, brew 등등 여러 패키지 관리자 사용하다 보면 문법이 헷갈리거등 이게

## TL;DR

```bash
sudo apt-get remove --purge -y ${패키지} \
    && sudo apt-get autoremove --purge -y
```