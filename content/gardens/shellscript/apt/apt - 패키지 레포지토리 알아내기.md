---
tags:
  - shellscript
  - bash-apt
date: 2024-01-11
---
> [!info] 참고한 것들
> - [스댕](https://askubuntu.com/a/347805)

## 개요

- 패키지가 여러 레포지토리를 통해 배포될 때, 가끔씩 설치된 패키지가 어느 레포지토리에서 왔는지 확인해야될 때가 있다.
	- 주인장은 GPU 서버에 설치된 NVIDIA 드라이버가 ubuntu 레포인지 cuda 레포인지 확인하느라 찾아봤었다.

## TL;DR

```bash
apt-cache policy ${패키지}
```