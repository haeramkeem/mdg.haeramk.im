---
tags:
  - 쉘스크립트
  - bash-ca-certificates
date: 2024-03-05
---
> [!info] [출처](https://superuser.com/a/719047)

## 개요

- `ca-certificates` 패키지를 이용해 인증서를 신뢰해보자
- (잘은 모르겠지만) 이 패키지는 Debian 계열에서 제공하는 패키지인듯... RHEL 에 있는지는 모르겠음

## TL;DR!

```bash
cp $TRUST_CERT.crt /usr/local/shared/ca-certificates/
sudo update-ca-certificates
```