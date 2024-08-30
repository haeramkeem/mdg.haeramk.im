---
tags:
  - shellscript
  - bash-openssl
date: 2024-08-30
---
## TL;DR

### CA

- `ca.cfg`

```
[req]
distinguished_name = cert_dn
x509_extensions = v3_req
prompt = no

[cert_dn]
CN = {{ CN 적당히 }}

[v3_req]
keyUsage = critical, digitalSignature, keyEncipherment, keyCertSign
basicConstraints = critical, CA:TRUE
subjectKeyIdentifier = hash
subjectAltName = @alt_names

[alt_names]
DNS.0 = {{ CN 이랑 동일하게 }}
```

- 생성

```bash
openssl req -x509 -new -nodes \
	-newkey rsa:2048 \
	-keyout ca.key \
	-out ca.crt \
	-config ca.cfg \
	-days 36500 \
	-set_serial 0
```

### CA-signed

- `tls.cfg`

```
[req]
distinguished_name = cert_dn
x509_extensions = v3_req
prompt = no

[cert_dn]
CN = {{ CN 적당히 }}

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.0 = {{ 원하는 Domain 들 }}
IP.0 = {{ 원하는 IP 들 }}
```

- 생성

```bash
openssl req -new -nodes \
	-newkey rsa:2048 \
	-keyout tls.key \
	-out tls.csr \
	-config tls.cfg

openssl x509 -req -sha256 \
	-days 3650 \
	-in tls.csr \
	-extensions v3_req \
	-extfile tls.cfg \
	-CA ca.crt \
	-CAkey ca.key \
	-CAcreateserial \
	-out tls.crt
```

