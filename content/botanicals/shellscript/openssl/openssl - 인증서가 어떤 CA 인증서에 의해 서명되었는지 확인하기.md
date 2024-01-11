---
tags:
  - 쉘스크립트
---
> [!info] [출처](https://security.stackexchange.com/a/232028)

## 개요

- 어떤 인증서가 있는데, 이 인증서가 어떤 [[Certificate Authority, CA (PKIX)|CA]] 인증서에 의해 서명되었는지 확인하고 싶을 때 사용하면 된다.

## TL;DR

```bash
openssl verify -verbose -CAfile ${CA인증서경로} ${검증하고자하는인증서}
```