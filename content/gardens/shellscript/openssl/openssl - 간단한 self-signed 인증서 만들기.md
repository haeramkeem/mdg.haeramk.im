---
tags:
  - shellscript
  - bash-openssl
date: 2024-07-09
---
## TL;DR

- 테스트, 디버깅 용으로 간단하게 인증서 하나 만들때
- 여기서 변형해서 상황에 맞게 사용하면 된다.

> [!tip]- `digitalSignature` 가 없으면?
> - `digitalSignature` 가 없으면 web 접근시 `ERR_SSL_KEY_USAGE_INCOMPATIBLE` 에러가 날 수 있다. ([참고](https://learn.microsoft.com/en-us/answers/questions/1657834/how-to-fix-the-err-ssl-key-usage-incompatible-micr))

```bash
cat << EOF > tls.cfg
[req]
distinguished_name = cert_dn
x509_extensions = v3_req
prompt = no

[cert_dn]
C = ${COUNTRY:=US}
ST = ${STATE:=Utah}
L = ${LOCALITY:=Lehi}
O = ${ORGANIZATION:=Digicert, Inc.}
OU = ${ORGANIZATION_UNIT:=Marketing}
CN = ${COMMON_NAME:=www.digicert.com}

[v3_req]
keyUsage = keyEncipherment, dataEncipherment, digitalSignature
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.0 = ${DOMAIN:=*.digicert.com}
IP.0 = ${IP_ADDR:=45.60.125.229}
EOF

openssl req -x509 -new -nodes -newkey rsa:2048 -keyout tls.key -out tls.crt -config tls.cfg -days 36500 -set_serial 0
```