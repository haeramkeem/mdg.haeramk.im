---
tags:
  - shellscript
  - bash-git
date: 2025-06-11
aliases:
  - 인증서 확인 비활성화하기
---
> [!info]- 참고한 것들
> - [스댕](https://stackoverflow.com/a/11622001)

## TL;DR

- Git private server 에서는 self-signed certificate 를 사용하기도 하는데, 이때 git 으로 뭘 하려고 할때 신뢰할 수 없는 인증서라고 징징대는 꼴을 볼 수 있다.
- 이때 아래의 옵션으로 이런 인증서 확인을 무시할 수 있다.

```bash
git -c http.sslVerify=false ...
```