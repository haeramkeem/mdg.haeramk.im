---
tags:
  - shellscript
  - bash-openssl
date: 2023-12-21
---
## 개요

- 인증서의 상세 정보를 확인하는 방법이다

## TL;DR!

- 인증서 입력은 기본적으로 표준입력이다:

```bash
echo "@@@ 인증서 PEM 어쩌고저쩌고 @@@" | openssl x509 -text -noout
```

- 아니면 `-in` 옵션으로 인증서 파일을 지정해 줄 수도 있다:

```bash
openssl x509 -text -noout -in $CERT_FILE.crt
```