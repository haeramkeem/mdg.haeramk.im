---
tags:
  - shellscript
  - bash-apt
date: 2025-05-23
---
> [!info]- 참고한 것들
> - [스댕](https://serverfault.com/a/156962)

## TL;DR

- 패키지 검색은 이걸 사용하면 된다.
	- 이렇게 하면 이름에 `xxx` 가 들어간 패키지가 모두 조회된다.

```bash
sudo apt-cache search xxx
```

- 어떤 패키지에 대해 어떤 버전들을 설치할 수 있는지 확인하는 것은 이걸 사용하면 된다.
	- 이렇게 하면 `xxx` 라는 패키지에 대한 버전이 전부 나온다.

```bash
sudo apt-cache madison xxx
```