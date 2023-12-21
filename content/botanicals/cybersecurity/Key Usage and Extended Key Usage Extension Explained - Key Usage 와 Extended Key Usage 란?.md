---
tags:
  - PKIX
---
> [!info] [참고한 문서](https://help.hcltechsw.com/domino/10.0.1/admin/conf_keyusageextensionsandextendedkeyusage_r.html)

## 개요

- 인증서 생성시에 명시할 Key Usage 와 Extended Key Usage 들에 대해 정리해 보자.
	- 물론, 모두 정리하지는 않고 사용해본 애들을 추가하며 정리해나갈 예정.

## 이런게 왜 필요하지?

- 인증서에 포함되어 있는 공개키의 사용 범위를 제한하는 역할을 한다.
- 기본적인 Key Usage 와 이것의 확장판이라고 할 수 있는 Extended Key Usage 가 있다.

## Key Usage (KU)

- 기본적인 Key Usage.
	- 즉, 인증서의 키가 어떻게 사용될 수 있는지를 명시하는 부분이다.
- OpenSSL Configuration 파일에는 다음처럼 명시할 수 있다.

```
[req]
x509_extensions = v3_req

[v3_req]
keyUsage = 항목들 나열...
```

### Digital Signature (`digitalSignature`)

- 어떤 형태로든 디지털 서명을 생성하는 일을 일컫는다.
- 아주 흔한 유스케이스이기 때문에, 인터넷 환경에서 사용되는 인증서에서는 기본적으로 활성화 되게 된다.

### Key Encipherment (`keyEncipherment`)

- 암호키를 암호화할 수 있게 하는 것
	- 인데, 이렇게만 말하면 뭔가 말장난같으니 조금 더 추가하자면, [[Symmetric Key for TLS - TLS 통신에 대칭키를 사용하는 이유|TLS 통신에 사용되는 대칭키를 비대칭 키로 암호화]] 하는 등의 유스케이스를 위한 기능이다.

### Certificate Signing (`keyCertSign`)

- 인증서를 서명할 수 있게 하는 것.
- 보통 Root / Intermediate CA 들에게 부여되어 자식 인증서를 생성해서 서명할 수 있도록 한다.

### Data Encipherment (`dataEncipherment`)

- 암호키가 아닌 애플리케이션 데이터를 암호화할 수 있게 하는 것
- 이것 또한 아주 흔한 유스케이스이기 때문에, 인터넷 환경에서 사용되는 인증서에서는 기본적으로 활성화 되게 된다.

## Extended Key Usage (EKU)

- 기본적인 Key Usage 들에 추가적인 기능들.
- 인데, 키 보다는 인증서가 어떻게 사용될 수 있는지를 명시하는 부분이라고 할 수 있다.
- OpenSSL Configuration 파일에는 다음처럼 명시할 수 있다.

```
[req]
x509_extensions = v3_req

[v3_req]
extendedKeyUsage = 항목들 나열...
```

- 여기 들어갈 수 있는 항목들을 살펴보자.

### TLS Web Server Authentication (`serverAuth`)

- 일반적인 TLS 통신에서, Server 가 CA 의 도움을 받아 자신의 신원을 인증할 수 있도록 하는 기능이다.

### TLS Web Client Authentication (`clientAuth`)

- 일반적인 TLS 에 사용되는 [[Key Usage and Extended Key Usage Extension Explained - Key Usage 와 Extended Key Usage 란?#TLS Web Server Authentication (`serverAuth`)|Server Auth]] 과 달리, [[Mutual TLS, mTLS (PKIX)|mTLS]] 통신에서 Client 가 CA 의 도움을 받아 자신의 신원을 인증할 수 있도록 하는 기능이다.