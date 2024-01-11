---
tags:
  - 쉘스크립트
---
> [!info] [출처](https://security.stackexchange.com/a/232028)

## 개요

- 보통은 [[Certificate Signing Request, CSR (PKIX)|CSR]] 을 만들고 그걸로 인증서를 생성하는데,
- 인증서를 재발급해서 교체하는 등의 작업을 할 때 역으로 인증서에서 CSR 를 빼내야 할 때가 있다.

## TL;DR

```bash
openssl x509 -x509toreq \
    -in ${인증서파일} \
    -signkey ${개인키파일}
```

- 간단하죠?
- 기본적으로 표준출력으로 결과가 반환되고, 파일로 저장하고싶으면 `>` 로 리다이렉트하던지 아니면 `-out` 옵션을 이용하면 된다.